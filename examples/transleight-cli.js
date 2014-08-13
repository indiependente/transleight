/**
 * Usage: 'cat | node transleight-cli.js TARGETLANGUAGE'
 * e.g.: 'cat | node transleight-cli.js it'
 * Type a sentence and hit return.
 * You will get the translation in the target language.
 */

var trnsl8	=	require('../');

var LANG = process.argv[2];

process.stdin.pipe(trnsl8.stream(LANG)).pipe(process.stdout);