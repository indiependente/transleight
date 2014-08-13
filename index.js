/**
 * transleight
 * A simple Node.js language translation tool (powered by GoogleTranslate)
 * author: indiependente
 */

var tr 			= 	require('through');
var langs 		=	require('./libs/supportedlangs.js').supportedlangs;
var tstream 	=	require('./libs/tstream.js');
var combine		=	require('stream-combiner');


function write(data){
	var options = 	{
		host 	: 	"translate.google.com",
		path 	: 	"/translate_a/single?client=t&sl=auto&tl=it&hl=it&dt=bd&dt=ex&dt=ld&dt=md&dt=qc&dt=rw&dt=rm&dt=ss&dt=t&dt=at&dt=sw&ie=UTF-8&oe=UTF-8&ssel=0&tsel=0",
		headers : 	{
					'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'
					},
		method 	: "POST"
	};
	function clean(string){
		var tmp = string;
    	if (tmp.indexOf('[[["') !== -1){
			tmp = tmp.replace('[[["', "");
		}
		else
			return "";
		if (tmp.indexOf('","') !== -1){
			tmp = tmp.substring(0,tmp.indexOf('","'));
		}
		return tmp.replace(/\\\"/g, '"').concat('\n');
	}
	this.queue(new Buffer(clean(data.toString())));
}
function end(data){
	if(arguments.length) write(data);
	this.queue(null);
}

var filtr = tr(write, end);




module.exports = {
	stream : function (lang){
		var target;
		var values = Object.keys(langs).map(function(k){return langs[k];});
		if (typeof lang === 'undefined') {
			throw new Error('No target language specified');
		}
		if (!(lang in langs) && !(values.indexOf(lang) > -1)) {
			console.error(lang);
			throw new Error('Unknown target language');
		}
		if (values.indexOf(lang) > -1){
			target = lang;
		}
		else if (lang in langs){
				target = langs[lang];
			}
		return combine(tstream(target), filtr);
	},
	supportedLangs : function (){
		return langs;
	}

};