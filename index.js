/**
 * transleight
 * A simple Node.js translation tool
 * author: indiependente
 */

var https 		=	require('https');
var tr 			= 	require('through');
var urlencode 	= 	require('urlencode');

var options = 	{
		host 	: 	"translate.google.com",
		path 	: 	"/translate_a/single?client=t&sl=auto&tl=it&hl=it&dt=bd&dt=ex&dt=ld&dt=md&dt=qc&dt=rw&dt=rm&dt=ss&dt=t&dt=at&dt=sw&ie=UTF-8&oe=UTF-8&ssel=0&tsel=0",
		headers : 	{
					'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'
					},
		method 	: "POST"
	};


function removeTrash(chunk){
	if (chunk.indexOf('"],["') < chunk.indexOf('","')){ //remove starting trash
		chunk = chunk.substring(chunk.indexOf('"],["'), chunk.length).replace('"],["',"");
	}
	// console.log(chunk);
	var toReturn = '';
	// while(chunk.indexOf('","') !== -1){
		toReturn += chunk.substring(0, chunk.indexOf('","')).concat("$$$\n");
		chunk = chunk.substring(chunk.indexOf('"],["'), chunk.length).replace('"],["',"");
		// console.log("\n\n\n%s",chunk);
	// }
	// if(chunk.indexOf('"],["') === -1){

	// }
	return toReturn.concat("\n\n\n").concat(chunk);
}

function write(data){
	// var q = this.queue;
	// var INTRANSLATION = false;
	var end = false;
	var req = https.request(options, function(result) {
		result.setEncoding('utf8');
	    result.on("data", function(chunk) { // play with regexp here
	    	if (chunk.indexOf('"]]') !== -1) {
	    		console.log('Last chunk');
	    		chunk = chunk.substring(0,chunk.indexOf('","'));
	    		process.stdout.write(chunk.concat('\n'));
	    		end = true;
	    	}
	    	if(!end)process.stdout.write(removeTrash(chunk.concat('\n')));
	    });
	});
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	req.write('q='+urlencode(data.toString()));
	req.end();
}


process.stdin.pipe(tr(write));






















