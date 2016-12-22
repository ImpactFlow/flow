'use strict';

var Graph = require('../lib/graph');
var GraphValidator = require('../lib/graph_validator');

function vertexData() {
    return {};
}

describe('graph_validator', function () {
    var edges;
    var graph;
    var source;
    var validator;
    var vertices;

    var itShouldThrowValidationError = function (expectedMessage) {
        it('should throw validation error', function () {
            var testFn = function () {
                validator.validate();
            };
            expect(testFn).toThrowError(expectedMessage);
        });
    };

    var itShouldValidateSuccessfully = function () {
        it('should validate successfully', function () {
            validator.validate();
        });
    };

    describe('when validating empty graph', function () {
        beforeEach(function () {
            validator = new GraphValidator();
        });
        itShouldThrowValidationError('Graph is not defined');
    });

    describe('when validating a graph with no source', function () {
        beforeEach(function () {
            vertices = {
                'v1': vertexData(),
            };
            source = undefined;
            graph = new Graph(vertices, edges, source);
            validator = new GraphValidator(graph);
        });
        itShouldThrowValidationError('Source is not defined');
    });

    describe('when validating a single-vertex graph', function () {
        beforeEach(function () {
            vertices = {
                'v1': vertexData(),
            };
            source = 'v1';
            graph = new Graph(vertices, edges, source);
            validator = new GraphValidator(graph);
        });
        itShouldValidateSuccessfully();
    });

    describe('when validating a single-vertex graph with mismatched source', function () {
        beforeEach(function () {
            vertices = {
                'v1': vertexData(),
            };
            source = 'not_a_real_source';
            graph = new Graph(vertices, edges, source);
            validator = new GraphValidator(graph);
        });
        itShouldThrowValidationError('Source "not_a_real_source" is an unknown vertex');
    });

    describe('when validating a 2-vertex graph', function () {
        beforeEach(function () {
            vertices = {
                'v1': vertexData(),
                'v2': vertexData(),
            };
            edges = {
                'v1': 'v2'
            };
            source = 'v1';
            graph = new Graph(vertices, edges, source);
            validator = new GraphValidator(graph);
        });
        itShouldValidateSuccessfully();
    });

    describe('when validating a 2-vertex graph with an orphaned vertex', function () {
        beforeEach(function () {
            vertices = {
                'v1': vertexData(),
                'v2': vertexData(),
            };
            edges = {};
            source = 'v1';
            graph = new Graph(vertices, edges, source);
            validator = new GraphValidator(graph);
        });
        itShouldThrowValidationError('Vertex "v2" is orphaned');
    });

    describe('when validating a 2-vertex graph with nonexistent edge source', function () {
        beforeEach(function () {
            vertices = {
                'v1': vertexData(),
            };
            edges = {
                'not_real_edge_source': 'v1'
            };
            source = 'v1';
            graph = new Graph(vertices, edges, source);
            validator = new GraphValidator(graph);
        });
        itShouldThrowValidationError('Edge target "not_real_edge_source" is an unknown vertex');
    });

    describe('when validating a 2-vertex graph with nonexistent edge sink', function () {
        beforeEach(function () {
            vertices = {
                'v1': vertexData(),
            };
            edges = {
                'v1': 'not_real_edge_sink'
            };
            source = 'v1';
            graph = new Graph(vertices, edges, source);
            validator = new GraphValidator(graph);
        });
        itShouldThrowValidationError('Edge target "not_real_edge_sink" is an unknown vertex');
    });
});
