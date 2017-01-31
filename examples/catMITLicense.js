var trnsl8	=	require('../');
var spawn 	=	require('child_process').spawn;


// 64 Supported languages
// var langs = trnsl8.supportedLangs();
// console.log(langs); // see what languages are supported and get their codes

// Transleight stream just needs to know the language you want to translate to.
// Here I choose to translate from the language detected in the LICENSE file to Italian.

var cat 	=	spawn('cat', ['../LICENSE']);
cat.stdout.pipe(trnsl8.stream('it')).pipe(process.stdout);