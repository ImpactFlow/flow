'use strict';

var Edge = require('../lib/edge');

describe('edge', function () {
    var edge;
    var edgeSource;
    var edgeSink;
    var pathChoiceFn;

    beforeEach(function () {
        edgeSource = 'v1';
        edgeSink = 'v2';
        pathChoiceFn = function (options) {
            return options.choose;
        };
    });

    var assertCommonBehavior = function () {
        it('should return edgeSource when calling getEdgeSource', function () {
            expect(edge.getEdgeSource()).toEqual(edgeSource);
        });

        it('should return edgeSink when calling getEdgeSink', function () {
            expect(edge.getEdgeSink()).toEqual(edgeSink);
        });
    };

    describe('when constructing with no pathChoiceFn', function () {
        beforeEach(function () {
            edge = new Edge(edgeSource, edgeSink);
        });

        assertCommonBehavior();

        it('should return true when calling shouldTakeEdge', function () {
            expect(edge.shouldTakeEdge()).toEqual(true);
        });
    });

    describe('when constructing with a pathChoiceFn', function () {
        beforeEach(function () {
            edge = new Edge(edgeSource, edgeSink, pathChoiceFn);
        });

        assertCommonBehavior();

        it('should return false when calling shouldTakeEdge with false-inducing options', function () {
            var result = edge.shouldTakeEdge({ choose: false });
            expect(result).toEqual(false);
        });

        it('should return true when calling shouldTakeEdge with true-inducing options', function () {
            var result = edge.shouldTakeEdge({ choose: true });
            expect(result).toEqual(true);
        });
    });
});
