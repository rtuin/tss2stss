'use strict';
function StssCompiler() {
    this.depth = 0;
}

StssCompiler.prototype.compile = function (parsedTssNodes) {
    var out = '';
    var nodes = parsedTssNodes.nodes;
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i],
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
                throw Error('Compiling of type "' + node.type + '" is not implemented yet.');
                break;
        }
        out += compiled;
    }
    return out;
};

StssCompiler.prototype.compileSelector = function(node) {
    var out = node.text.replace(/\"/g, '') + ' ';
    out += this.compile(node);
    return out;
};

StssCompiler.prototype.compilePropertyDefinition = function(node) {
    return this.getIndentation() + this.normalizePropertyDefinitions(node.text) + ' ' + this.compile(node) + "\n";
};

StssCompiler.prototype.compileStyleValue = function(node) {
    return this.normalizeStyleValue(node.text) + ';';
};
StssCompiler.prototype.compileOpenScope = function(node) {
    this.depth++;
    return "{\n" + this.compile(node);
};
StssCompiler.prototype.compileCloseScope = function(node) {
    this.depth--;
    return this.getIndentation() + "}\n";
};
StssCompiler.prototype.getIndentation = function() {
    if (this.depth == 0) {
        return '';
    }
    return (new Array(this.depth+1)).join('    ');
};

StssCompiler.prototype.normalizePropertyDefinitions = function (definition) {
    definition = definition.trim();

    //if (definition.indexOf('font') != 0 && definition.indexOf('text')) {
    //    return definition;
    //}
    return definition.replace(/([A-Z])/g, function (all, matchOne) { return '-' + matchOne.toLowerCase() });
};

StssCompiler.prototype.normalizeStyleValue = function (value) {
    value = value.trim();
    return value.replace('Ti.UI.SIZE', '\'size\'');
};

module.exports = StssCompiler;
