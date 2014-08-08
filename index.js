/**
 * transleight
 * A simple Node.js translation tool
 * author: indiependente
 */

var https 		=	require('https');
var tr 			= 	require('through');
var qs 			=	require('querystring');
var urlencode 	= 	require('urlencode');

var options = 	{
		host 	: 	"translate.google.com",
		path 	: 	"/translate_a/single?client=t&sl=auto&tl=it&hl=it&dt=bd&dt=ex&dt=ld&dt=md&dt=qc&dt=rw&dt=rm&dt=ss&dt=t&dt=at&dt=sw&ie=UTF-8&oe=UTF-8&ssel=0&tsel=0",
		headers : 	{
			'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'
		},
		method 	: "POST"
	};

function write(data){

	var req = https.request(options, function(result) {
		result.setEncoding('utf8');
	    result.on("data", function(chunk) {

	        process.stdout.write(chunk.concat('\n'));
	    });
	});
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	req.write('q='+data.toString());
	req.end();
}


process.stdin.pipe(tr(write));






















