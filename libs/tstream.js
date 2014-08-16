var combine		=	require('stream-combiner');
var request     = 	require('request');
var Stream      = 	require('stream');
// var chunknlines = 	require('chunknlines');
var urlencode   =	require('urlencode');
// var zlib        =	require('zlib');
var through		=	require('through');
var sbdStream	=	require('../../sbd-stream/');

var tstream = function(lang){

	var encoder = through(
					function write(buf){this.queue(urlencode(buf));},
					function end(buf){if(arguments.length) write(buf);this.queue(null);}
					);

	var target = lang;
	var translator = new Stream;
	translator.writable = true;
	translator.readable = true;
	translator.write = write;
	translator.end = end;
	translator.pendings = 0;

	function write(buf){
		var template = 'https://translate.google.com/translate_a/single?client=t&sl=auto&tl=$$$&hl=$$$&dt=bd&dt=ex&dt=ld&dt=md&dt=qc&dt=rw&dt=rm&dt=ss&dt=t&dt=at&dt=sw&ie=UTF-8&oe=UTF-8&ssel=0&tsel=0';
		var options = {
			url 	:	'',
			headers : 	{
						'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'
						// , "accept-encoding" : "gzip"
						},
			method 	: "POST",
			encoding: null,
			body	: ''
		};

		options.url = template.replace(/\$\$\$/g, target);
		// console.log(options.url);
		options.body = 'q='+buf;
		translator.pendings++;
		var res_stream = request(options,function(err, res, body){
			if (!err && res.statusCode == 200){
				// console.log(body.toString());
				translator.emit('data', body);
				translator.pendings--;
			}
		});
		res_stream.on('end',function(){
			// console.log('\npendings: '+translator.pendings);
			if(!translator.pendings)
				{translator.emit('end');}
		});
	};
	function end(buf){
		if(arguments.length) write(buf);
		// console.log(translator.pendings);
	};

	var decoder = through(
					function write(buf){this.queue(urlencode.decode(buf));},
					function end(buf){if(arguments.length) write(buf);this.queue(null);}
					);

	return combine(sbdStream, encoder, translator, decoder);//, zlib.createGunzip());

};

module.exports = tstream;