'use strict';

var _ = require('underscore');
var extend = require('./extend');

var GraphValidator = function (graph) {
    this.graph = graph;
};
GraphValidator.extend = _.partial(extend, GraphValidator);

var missingValue = function (array, value) {
    return array.indexOf(value) === -1;
};

_.extend(GraphValidator.prototype, {
    validate: function () {
        this.validateDefinedGraph();
        this.validateSourceVertexExists();
        this.validateNoOrphanedVertices();
        this.validateEdgeVerticesExist();
    },

    validateDefinedGraph: function () {
        if (!this.graph) {
            throw new Error('Graph is not defined');
        }
    },

    validateNoOrphanedVertices: function () {
        var allTargets = this.graph.getAllTargets();
        this.graph.getAllVertexNames().forEach(function (vertex) {
            if (missingValue(allTargets, vertex)) {
                throw new Error('Vertex "' + vertex + '" is orphaned');
            }
        });
    },

    validateEdgeVerticesExist: function () {
        var vertices = this.graph.getAllVertexNames();
        this.graph.getAllEdgeTargets().forEach(function (target) {
            if (missingValue(vertices, target)) {
                throw new Error('Edge target "' + target + '" is an unknown vertex');
            }
        });
    },

    validateSourceVertexExists: function () {
        if (!this.graph.getSourceVertex()) {
            throw new Error('Source is not defined');
        }

        var vertices = this.graph.getAllVertexNames();
        var source = this.graph.getSourceVertex();
        if (missingValue(vertices, source)) {
            throw new Error('Source "' + source + '" is an unknown vertex');
        }
    },
});

module.exports = GraphValidator;
