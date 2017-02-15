'use strict';

var _ = require('underscore');
var assertWith = require('./assert_with');
var extend = require('./extend');
var GraphComposer = require('./graph_composer');


var Flow = function (options) {
    assertWith(options).expectProperty('graph', 'Flow requires a graph');
    this.actions = options.actions || [];
    this.whenFinishedFunctions = options.when_finished_functions || [];
    this.graph = options.graph;
    this.currentVertex = this.getGraph().getSourceVertex();
};
Flow.extend = _.partial(extend, Flow);

_.extend(Flow.prototype, {
    _readyActions: function () {
        var flow = this;
        return this.actions.map(function (action) {
            action.setFlow(flow);
            return action;
        });
    },

    _startActions: function () {
        var actions = this._readyActions(this.getCurrent());
        actions.forEach(function (action) {
            action.start(this.currentVertex.getPayload());
        }.bind(this));
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
        var actions = [].concat(
            this.getActions(),
            otherFlow.getActions()
        );
        var whenFinishedFunctions = [].concat(
            this.getWhenFinishedFunctions(),
            otherFlow.getWhenFinishedFunctions()
        );
        return new Flow({
            actions: actions,
            when_finished_functions: whenFinishedFunctions,
            graph: composedGraph,
        });
    },

    getActions: function () {
        return this.actions;
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

    jumpTo: function (name) {
        if (this.graph.hasVertexNamed(name)) {
            this.currentVertex = this.graph.getVertexNamed(name);
            this._startActions();
            return true;
        }
        return false;
    },

    next: function (options) {
        var vertex = this.graph.getNextVertex(this.currentVertex, options);
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
