// Use of this source code is governed by a MIT-style license that can be 
// found in the LICENSE file.

function StssCompiler() {
    'use strict';
    this.depth = 0;
    this.shortHands = {
        'Selector': {
            'ios': 'platform=ios',
            'android': 'platform=android',
            'blackberry': 'platform=blackberry',
            'mobileweb': 'platform=mobileweb',
            'handheld': 'formFactor=handheld',
            'tablet': 'formFactor=tablet'
        },
        'StyleValue': {
            'size': 'Ti.UI.SIZE',
            'fill': 'Ti.UI.FILL',
            'left': 'Ti.UI.TEXT_ALIGNMENT_LEFT',
            'center': 'Ti.UI.TEXT_ALIGNMENT_CENTER',
            'right': 'Ti.UI.TEXT_ALIGNMENT_RIGHT'
        }
    }
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
        node.parent = parsedTssNodes;

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

StssCompiler.prototype.normalizeSelector = function (node) {
    var nodeText = node.text.replace(/\"/g, '');
    for (var shorthand in this.shortHands.Selector) {
        nodeText = nodeText.replace(this.shortHands.Selector[shorthand], shorthand);
    }
    return nodeText;
};
StssCompiler.prototype.compileSelector = function (node) {
    'use strict';
    var out = this.normalizeSelector(node) + ' ';
    out += this.compile(node);
    return out;
};

StssCompiler.prototype.compilePropertyDefinition = function (node) {
    'use strict';
    return this.getIndentation() + this.normalizePropertyDefinitions(node) + ' ' + this.compile(node) + "\n";
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

    var definitionText = definition.text.trim();
    if (
        definitionText.substr(0, 4) === 'font' &&
        definition.parent.parent.type === 'PropertyDefinition' &&
        definition.parent.parent.text === 'font:'
    ) {
        definitionText = definitionText.substr(4).replace(/([A-Z])/, function (all, matchOne) { return matchOne.charAt(0).toLowerCase() + matchOne.substr(1); });
    }

    return definitionText.replace(/([A-Z])/g, function (all, matchOne) { return '-' + matchOne.toLowerCase(); });
};

StssCompiler.prototype.normalizeStyleValue = function (value) {
    'use strict';
    value = value.trim();

    for (var shorthand in this.shortHands.StyleValue) {
        value = value.replace(this.shortHands.StyleValue[shorthand], shorthand);
    }
    return value;
};

module.exports = StssCompiler;
