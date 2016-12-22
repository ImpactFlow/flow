'use strict';

var _ = require('underscore');
var extend = require('./extend');
var Flow = require('./flow');
var Graph = require('./graph');

var Builder = function () {
    this.vertices = {};
    this.edges = {};
    this.source = undefined;
    this.graph = undefined;
    this.actionBuilderFunctions = [];
    this.whenFinishedFunctions = [];
};
Builder.extend = _.partial(extend, Builder);

_.extend(Builder.prototype, {
    addActionBuilder: function (actionBuilderFn) {
        this.actionBuilderFunctions.push(actionBuilderFn);
        return this;
    },

    addVertex: function (name, payload, next) {
        this.vertices[name] = payload;
        if (next) {
            this.edges[name] = next;
        }
        return this;
    },

    build: function () {
        this.graph = new Graph(this.vertices, this.edges, this.source);
        return new Flow({
            graph: this.graph,
            action_builder_functions: this.actionBuilderFunctions,
            when_finished_functions: this.whenFinishedFunctions,
        });
    },

    startAtVertex: function (sourceVertexName) {
        this.source = sourceVertexName;
        return this;
    },

    whenFinished: function (whenFinishedFn) {
        this.whenFinishedFunctions.push(whenFinishedFn);
        return this;
    },
});

module.exports = Builder;
