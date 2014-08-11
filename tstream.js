var combine		=	require('stream-combiner');
var request     = 	require('request');
var Stream      = 	require('stream');
var chunknlines = 	require('chunknlines');
var urlencode   =	require('urlencode');
var zlib        =	require('zlib');
var through		=	require('through');
// var concat 		=	require('concat-stream');

var tstream = function(){
	var buffer = [];
	var encoder = through(
					function write(buf){this.queue(urlencode(buf));},
					function end(buf){if(arguments.length) write(buf);this.queue(null);}
					);

	var translator = new Stream;
	translator.writable = true;
	translator.readable = true;
	translator.write = write;
	translator.end = end;
	translator.pendings = 0;

	function write(buf){
		var options = {
			url 	:	"https://translate.google.com/translate_a/single?client=t&sl=auto&tl=it&hl=it&dt=bd&dt=ex&dt=ld&dt=md&dt=qc&dt=rw&dt=rm&dt=ss&dt=t&dt=at&dt=sw&ie=UTF-8&oe=UTF-8&ssel=0&tsel=0",
			headers : 	{
						'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'
						// , "accept-encoding" : "gzip"
						},
			method 	: "POST",
			encoding: null,
			body	: ''
		};
		options.body = 'q='+buf;
		translator.pendings++;
		var res_stream = request(options,function(err, res, body){
			if (!err && res.statusCode == 200){
				// console.log(body);
				translator.emit('data',body);
				translator.pendings--;
			}
		});
		res_stream.on('end',function(){

			// console.log('\npendings: '+translator.pendings);
			if(!translator.pendings)
				{console.log('end');translator.emit('end');}
		});
	};
	function end(buf){
		if(arguments.length) write(buf);
		// console.log(translator.pendings);
	};


	return combine(chunknlines(), encoder, translator);//, zlib.createGunzip());

};

process.stdin.pipe(tstream()).pipe(process.stdout);