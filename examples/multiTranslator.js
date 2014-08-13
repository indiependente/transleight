/**
 * If you're on Mac OS X this colud give you the error EMFILE. That's because it opens 64 file descriptors.
 * To solve this problem, give this command in the shell where you test the example:
 * 'ulimit -n 10000'
 */
var trnsl8	=	require('../');
var spawn 	=	require('child_process').spawn;
var fs 		=	require('fs');

var langs = trnsl8.supportedLangs();
for (lang in langs)
	spawn('cat', ['LICENSE']).stdout.pipe(trnsl8.stream(lang)).pipe(fs.createWriteStream('translation.txt'));
