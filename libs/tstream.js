var combine		=	require('stream-combiner');
var request     = 	require('request');
var Stream      = 	require('stream');
var chunknlines = 	require('chunknlines');
var urlencode   =	require('urlencode');
var through		=	require('through');
const token = require('google-translate-token'); // recent changes in Google Translate request params need this token
// var zlib        =	require('zlib');

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
		var decoded_buf = urlencode.decode(buf)
		token.get(decoded_buf).then(
			function (tk) {
				var options = {
							url 	:	'https://translate.google.com/translate_a/single?client=t&sl=auto&tl=$$$&hl=$$$&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&source=btn&ssel=0&tk=TOKEN&q='+buf,
							headers : 	{
										'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
										'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:49.0) Gecko/20100101 Firefox/49.0',
										// 'accept-encoding' : 'plain',
										// 'Cookie' : 'NID=92=EQcfF_xg9OVwdR1eKIHRxZYWzd8GC6FnzSh4ku6EOLySSYe7QhPD1_fiBkL4ugqZmwfSh2YNe08JJ0uK8pNNal5GBoyiMQKgr3mw5525_6VkKfHsUx3SF9raE9rSCl7kd_RqttiQWT-JMMLfhtXd44LyYZM9ifzdJDiOTFs1azeUsSUVSqN8ZkI; SID=HQTBhlJSBvVQKqVT6XTuCI0sly32d5BPBPyufoDn8Pvx2B2-fNGOXHf6Ps23qIRyX0X1Yw.; HSID=A9x9FNynn2CwOn1Hr; SSID=All2pUWWLcnb5Crxv; APISID=HF41EQ37Vr7dkyLo/A2Obvon_0c82BDGG7; SAPISID=lLuEgzcdks9CT1zr/Am1O3o2AdytfZvnb8; CONSENT=YES+IT.it+20150628-20-0; GMAIL_RTT=73',
										// // 'Connection' : 'keep-alive',
										// 'Host' : 'translate.google.com',
										// 'Upgrade-Insecure-Requests' : '1'
										},
							method 	: "GET"
					};
		
					options.url = options.url.replace(/\$\$\$/g, target);
					options.url = options.url.replace(/TOKEN/g, tk.value);
					// console.log(options.url);
					
					translator.pendings++;
					var res_stream = request(options, function(err, res, body){
						// console.log(res.statusCode + ' ' + res.statusMessage)
						if (!err && res.statusCode == 200) {
							// console.log(body.toString());
							translator.emit('data', body);
							translator.pendings--;
						}
					});
					res_stream.on('end', function() {
						// console.log('\npendings: '+translator.pendings);
						if(!translator.pendings)
							{translator.emit('end');}
					});
			}
		);
	};
	function end(buf){
		if(arguments.length) write(buf);
		// console.log(translator.pendings);
	};

	var decoder = through(
					function write(buf){this.queue(urlencode.decode(buf));},
					function end(buf){if(arguments.length) write(buf);this.queue(null);}
					);

	return combine(chunknlines(), encoder, translator, decoder);//, zlib.createGunzip());

};

module.exports = tstream;