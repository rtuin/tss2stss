// Use of this source code is governed by a MIT-style license that can be 
// found in the LICENSE file.

function StssCompiler() {
    'use strict';
    this.depth = 0;
}

StssCompiler.prototype.compile = function (parsedTssNodes) {
    'use strict';
    var out = '',
        nodes = parsedTssNodes.nodes,
        i = 0,
        node,
        compiled = '';
    for (i = 0; i < nodes.length; i++) {
        node = nodes[i];

        compiled = '';
        switch (node.type) {
        case 'Selector':
            compiled = this.compileSelector(node);
            break;
        case 'PropertyDefinition':
            compiled = this.compilePropertyDefinition(node);
            break;
        case 'StyleValue':
            compiled = this.compileStyleValue(node);
            break;
        case 'OpenScope':
            compiled = this.compileOpenScope(node);
            break;
        case 'CloseScope':
            compiled = this.compileCloseScope(node);
            break;
        default:
            throw new Error('Compiling of type "' + node.type + '" is not implemented yet.');
        }
        out += compiled;
    }
    return out;
};

StssCompiler.prototype.compileSelector = function (node) {
    'use strict';
    var out = node.text.replace(/\"/g, '') + ' ';
    out += this.compile(node);
    return out;
};

StssCompiler.prototype.compilePropertyDefinition = function (node) {
    'use strict';
    return this.getIndentation() + this.normalizePropertyDefinitions(node.text) + ' ' + this.compile(node) + "\n";
};

StssCompiler.prototype.compileStyleValue = function (node) {
    'use strict';
    return this.normalizeStyleValue(node.text) + ';';
};
StssCompiler.prototype.compileOpenScope = function (node) {
    'use strict';
    this.depth++;
    return "{\n" + this.compile(node);
};
StssCompiler.prototype.compileCloseScope = function () {
    'use strict';
    this.depth--;
    return this.getIndentation() + "}\n";
};
StssCompiler.prototype.getIndentation = function () {
    'use strict';
    if (this.depth === 0) {
        return '';
    }
    return new Array(this.depth + 1).join('    ');
};

StssCompiler.prototype.normalizePropertyDefinitions = function (definition) {
    'use strict';
    definition = definition.trim();

    return definition.replace(/([A-Z])/g, function (all, matchOne) { return '-' + matchOne.toLowerCase(); });
};

StssCompiler.prototype.normalizeStyleValue = function (value) {
    'use strict';
    value = value.trim();
    return value.replace('Ti.UI.SIZE', 'size')
        .replace('Ti.UI.FILL', 'fill')
        .replace('Ti.UI.TEXT_ALIGNMENT_LEFT', 'left')
        .replace('Ti.UI.TEXT_ALIGNMENT_CENTER', 'center')
        .replace('Ti.UI.TEXT_ALIGNMENT_RIGHT', 'right')
        ;
};

module.exports = StssCompiler;
