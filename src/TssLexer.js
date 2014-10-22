// Use of this source code is governed by a MIT-style license that can be 
// found in the LICENSE file.

var LexerModule = require('./external/lexer.js'),
    lexer = LexerModule.McLexer;

function TssLexer() {
    'use strict';
}
TssLexer.prototype.lex = function (tssString) {
    'use strict';
    var INIT = lexer.State(),
        tokens = [];

    function Selector(string) {
        this.string = string;
    }

    function Definer(string) {
        this.string = string;
    }

    function OpenScope(string) {
        this.string = string;
    }

    function CloseScope(string) {
        this.string = string;
    }

    function PropertyDefinition(string) {
        this.string = string;
    }

    function StyleValue(string) {
        this.string = string;
    }

    function ValueSeparator(string) {
        this.string = string;
    }


    function addStyleValue(match, rest, state) {
        tokens.push(new StyleValue(match[0]));
        return state.continuation(rest);
    }

    INIT(/\"(#|\.)?[a-zA-Z0-9]+\"/)(function (match, rest, state) {
        if (tokens.length && tokens[tokens.length - 1].constructor.name === 'PropertyDefinition') {
            return addStyleValue(match, rest, state);
        }
        tokens.push(new Selector(match[0]));
        return state.continuation(rest);
    });

    INIT(/:/)(function (match, rest, state) {
        tokens.push(new Definer(match[0]));
        return state.continuation(rest);
    });

    INIT(/{/)(function (match, rest, state) {
        tokens.push(new OpenScope(match[0]));
        return state.continuation(rest);
    });
    INIT(/}/)(function (match, rest, state) {
        tokens.push(new CloseScope(match[0]));
        return state.continuation(rest);
    });
    INIT(/[a-zA-Z]+:/)(function (match, rest, state) {
        tokens.push(new PropertyDefinition(match[0]));
        return state.continuation(rest);
    });

    INIT(/(\'|\")?(\[[A-Za-z0-9\.%_#,/-]+\s?[A-Za-z0-9\.%_#]*\]|[A-Za-z0-9\.%_#/-]+\s?[A-Za-z0-9\.%_#]*)(\'|\")?/)(function (match, rest, state) {
        return addStyleValue(match, rest, state);
    });

    INIT(/,/)(function (match, rest, state) {
        tokens.push(new ValueSeparator(match[0]));
        return state.continuation(rest);
    });

    INIT(/\s+/)(function (match, rest, state) {
        return state.run(rest);
    });

    INIT(/\/\/[^\n]*/)(function (match, rest, state) {
        return state.continuation(rest);
    });

    INIT(/$/)(function () {
        return null;
    });

    INIT.lex(tssString);
    return tokens;
};
module.exports = TssLexer;
