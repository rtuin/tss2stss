var util = require('util');

function TssParser() {
    'use strict';
    this.nodes = [];
}

TssParser.prototype.parse = function (tssTokens) {
    'use strict';
    var nodes = {nodes: []},
        lastParsed = '',
        expected = ['Selector'],
        scopeDepth = 0,
        currentNode = nodes,
        i,
        token,
        tokenType;
    function parseError(typeName, source, text, expected) {
        var tokenErrorIndex;
        for (tokenErrorIndex = 0; tokenErrorIndex < tssTokens.length; tokenErrorIndex++) {
            console.log(util.inspect(tssTokens[tokenErrorIndex]));
        }
        throw new Error('Parse error: unexpected ' + typeName + '("' + text + '") after "' + source + '". Expected: ' + expected.join(', ') + ' Last parsed: ' + lastParsed);
    }

    for (i = 0; i < tssTokens.length; i++) {
        token = tssTokens[i];
        tokenType = token.constructor.name;

        if (expected.indexOf(tokenType) === -1) {
            if (nodes.length) {
                parseError(tokenType, nodes[nodes.length - 1].text, token.text, expected);
            } else {
                parseError(tokenType, '', token.text, expected);
            }
        }

        lastParsed = tokenType;

        if (tokenType === 'Selector') {
            expected = ['Definer'];
        } else if (tokenType === 'Definer') {
            expected = ['OpenScope'];
        } else if (tokenType === 'OpenScope') {
            scopeDepth++;
            expected = ['CloseScope', 'PropertyDefinition'];
        } else if (tokenType === 'CloseScope') {
            scopeDepth--;
            expected = ['ValueSeparator'];
            if (scopeDepth) {
                expected.push('CloseScope');
            }
        } else if (tokenType === 'PropertyDefinition') {
            scopeDepth++;
            expected = ['OpenScope', 'StyleValue'];
        } else if (tokenType === 'ValueSeparator') {
            expected = ['Selector', 'PropertyDefinition', 'CloseScope'];
        } else if (tokenType === 'StyleValue') {
            scopeDepth--;
            expected = ['ValueSeparator', 'CloseScope'];
        }

        if (['ValueSeparator', 'Definer'].indexOf(tokenType) === -1) {
            currentNode.nodes.push({
                type: tokenType,
                text: token.string,
                nodes: []
            });
        }

        currentNode = this.findLastNode(nodes, scopeDepth);
    }

    return nodes;
};

TssParser.prototype.findLastNode = function (baseNode, scopeDepth) {
    'use strict';
    if (scopeDepth === 0 || baseNode.nodes.length === 0) {
        return baseNode;
    }
    var deepestDirectChild = baseNode.nodes[baseNode.nodes.length - 1];


    return this.findLastNode(deepestDirectChild, --scopeDepth);
};

module.exports = TssParser;
