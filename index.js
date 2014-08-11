/**
 * transleight
 * A simple Node.js language translation tool (powered by GoogleTranslate)
 * author: indiependente
 */

var https 		=	require('https');
var tr 			= 	require('through');
var urlencode 	= 	require('urlencode');
var splitnlines = 	require('splitnlines');
var Stream 		=	require('stream');
var streamify 	=	require('streamify');
var fs 			=	require('fs');
var langs 		=	require('./supportedlangs.js').supportedlangs;
function showSupportedLangs(){
	return langs;
}

var options = 	{
		host 	: 	"translate.google.com",
		path 	: 	"/translate_a/single?client=t&sl=auto&tl=it&hl=it&dt=bd&dt=ex&dt=ld&dt=md&dt=qc&dt=rw&dt=rm&dt=ss&dt=t&dt=at&dt=sw&ie=UTF-8&oe=UTF-8&ssel=0&tsel=0",
		headers : 	{
					'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'
					},
		method 	: "POST"
	};


var ts = new Stream;
ts.writable = true;
ts.readable = true;
ts.write = write;
ts.end = end;

function removeTrash(chunk){
	chunk = chunk.replace(/(\r\n|\r)/gm, "\n");
	var DELIM_A = '","';
	var DELIM_B = '"],["';
	if (chunk.indexOf(DELIM_B) < chunk.indexOf(DELIM_A)){ //remove starting trash
		chunk = chunk.substring(chunk.indexOf(DELIM_B), chunk.length).replace(DELIM_B,"");
	}

	while(chunk.indexOf(DELIM_A) !== -1){
		var toReplace;
		if (chunk.indexOf(DELIM_B) !== -1) {
			toReplace = chunk.substring(chunk.indexOf(DELIM_A), chunk.indexOf(DELIM_B));
		}
		else{
			toReplace = chunk.substring(chunk.indexOf(DELIM_A), chunk.length);
		}
		chunk = chunk.replace(toReplace,"").replace(DELIM_B,"");
	}

	return chunk;
}

function write(data){
	// var daq = this.queue;
	var end = false;
	var req = https.request(options, function(result) {
		result.setEncoding('utf8');
	    result.on("data", function(chunk) {
	    	var stream = streamify();
	    	stream.resolve(chunk);
	    	// console.log(chunk);
	    	if (chunk.indexOf('[[["') !== -1){ // First chunk
				chunk = chunk.replace('[[["', "");
			}
	    	if (chunk.indexOf('"]]') !== -1) { // Last chunk
	    		chunk = chunk.substring(0,chunk.indexOf('","'));
	    		// ts.emit('data',chunk);
	    		stream.resolve(chunk);
	    		end = true;
	    		return;
	    	}
	    	if(!end)
	    		stream.resolve(chunk);
	    		// ts.emit('data',removeTrash(chunk));
	    });
	});
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	req.write('q='+urlencode(data.toString()));
	req.end();
}
function end(buf){
	if(arguments.length) ts.write(buf);
	ts.emit('end');
}

process.stdin.pipe(splitnlines(1)).pipe(tr(write,end)).pipe(process.stdout);
// process.stdin.pipe(splitnlines(800)).pipe(tr(write)).pipe(process.stdout);
// process.stdin.pipe(tr(function(chunk){this.queue(chunk.toString().replace(/(\r\n|\r)/gm, "\n"));})).pipe(process.stdout);






















