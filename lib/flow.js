'use strict';

var _ = require('underscore');
var assertWith = require('./assert_with');
var extend = require('./extend');
var GraphComposer = require('./graph_composer');


var Flow = function (options) {
    assertWith(options).expectProperty('graph', 'Flow requires a graph');
    this.actionBuilderFunctions = options.action_builder_functions || [];
    this.whenFinishedFunctions = options.when_finished_functions || [];
    this.graph = options.graph;
    this.currentVertex = this.getGraph().getSourceVertex();
};
Flow.extend = _.partial(extend, Flow);

_.extend(Flow.prototype, {
    _buildActions: function (vertex) {
        var flow = this;
        var payload= this.getGraph().getVertexPayload(vertex);
        return this.actionBuilderFunctions.map(function (actionBuilderFn) {
            return actionBuilderFn(flow, payload);
        });
    },

    _startActions: function () {
        var actions = this._buildActions(this.getCurrent());
        actions.forEach(function (action) {
            action.start();
        });
    },

    _triggerWhenFinished: function () {
        this.whenFinishedFunctions.forEach(function (whenFinishedFn) {
            whenFinishedFn();
        });
    },

    compose: function (otherFlow) {
        var composedGraph = new GraphComposer(
            this.getGraph(),
            otherFlow.getGraph()
        ).compose();
        var actionBuilderFunctions = [].concat(
            this.getActionBuilderFunctions(),
            otherFlow.getActionBuilderFunctions()
        );
        var whenFinishedFunctions = [].concat(
            this.getWhenFinishedFunctions(),
            otherFlow.getWhenFinishedFunctions()
        );
        return new Flow({
            action_builder_functions: actionBuilderFunctions,
            when_finished_functions: whenFinishedFunctions,
            graph: composedGraph,
        });
    },

    getActionBuilderFunctions: function () {
        return this.actionBuilderFunctions;
    },

    getCurrent: function () {
        return this.currentVertex;
    },

    getGraph: function () {
        return this.graph;
    },

    getWhenFinishedFunctions: function () {
        return this.whenFinishedFunctions;
    },

    jumpTo: function (vertex) {
        if (this.graph.hasVertex(vertex)) {
            this.currentVertex = vertex;
            this._startActions();
            return true;
        }
        return false;
    },

    next: function () {
        var vertex = this.graph.getNextVertex(this.currentVertex);
        if (vertex) {
            this.currentVertex = vertex;
            this._startActions();
        } else {
            this._triggerWhenFinished();
        }
    },

    start: function () {
        this.currentVertex = this.getGraph().getSourceVertex();
        this._startActions();
    },
});

module.exports = Flow;
