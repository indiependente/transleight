transleight
===========

Node.js translation stream module

##What is transleight
transleight is a Stream. So everything you pipe into it, is transformed in the target language you specified.
__LANGUAGE-A => transleight => LANGUAGE-B__

_Super easy!_

The translation is powered by _Google Translate_

##APIs
transleight offers two apis:
- `transleight.stream(lang)` : it returns a stream that converts every text that receives in input, into text in language _lang_.
- `transleight.supportedLangs()` : it returns an object containing all the supported languages. Every entry has the `Language` as key and the `Code` as value. E.g. ```json{ English : 'en' }```.

##Installation
transleight is on https://www.npmjs.org

`npm install transleight`

##Examples
The `examples` folder contains more code.

transleight should be used like every other stream:

```javascript
var trnsl8 = require('transleight');

streamA.pipe(trnsl8.stream('targetLanguage')).pipe(streamB);
```

##ToDo
- [x] Accept Encoding _gzip_
- [ ] Sentence Boundary Splitting

##License
####MIT
