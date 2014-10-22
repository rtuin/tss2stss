var TssLexer = require('./tsslexer.js'),
    TssParser = require('./tssparser.js'),
    StssCompiler = require('./StssCompiler.js');

function Tss2Stss() {
    'use strict';
}

/**
 * Convert TSS input data to STSS output data
 *
 * @param tssData
 * @returns {*}
 */
Tss2Stss.prototype.convert = function (tssData) {
    'use strict';
    var tssLexer = new TssLexer(),
        tssParser = new TssParser(),
        compiler = new StssCompiler(),
        lexTokens = tssLexer.lex(tssData),
        parsedTss = tssParser.parse(lexTokens);
    return compiler.compile(parsedTss);
};

module.exports = Tss2Stss;
