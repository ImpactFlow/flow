'use strict';

var Builder = require('../lib/builder');
var helpers = require('./helpers');

var expectEdgesMatch = helpers.expectEdgesMatch;

describe('builder', function () {
    var actionBuilderFn;
    var builder;
    var flow;
    var whenFinishedFn;
    beforeEach(function () {
        builder = new Builder();
        actionBuilderFn = jasmine.createSpy();
        whenFinishedFn = jasmine.createSpy();
    });

    describe('when building with vertices', function () {
        beforeEach(function () {
            flow = builder
                .addVertex({
                    name: 'v1',
                    next: 'v2'
                }, 'v1: payload')
                .addVertex({
                    name: 'v2',
                    next: 'v3',
                }, 'v2:payload')
                .addVertex({
                    name: 'v3',
                }, 'v3:payload')
                .startAtVertex('v1')
                .addActionBuilder(actionBuilderFn)
                .addActionBuilder(actionBuilderFn)  // Yes, we're testing adding multiples :)
                .whenFinished(whenFinishedFn)
                .whenFinished(whenFinishedFn)   // Same as above here
                .build();
        });

        it('should create a graph matching definition', function () {
            var graph = flow.getGraph();
            expect(graph.getAllVertexNames()).toEqual(['v1', 'v2', 'v3']);
            expectEdgesMatch(graph, {
                'v1': 'v2',
                'v2': 'v3',
            });
            expect(graph.getSourceName()).toEqual('v1');
        });

        it('should inject action builders and finished functions', function () {
            expect(flow.getActionBuilderFunctions()).toEqual([
                actionBuilderFn,
                actionBuilderFn,
            ]);
            expect(flow.getWhenFinishedFunctions()).toEqual([
                whenFinishedFn,
                whenFinishedFn,
            ]);
        });
    });

    describe('when building with multi-edge vertices', function () {
        beforeEach(function () {
            flow = builder
                .addVertex({
                    name: 'v1',
                    next: {
                        v2: function (options) {
                            return options.path === 'v2';
                        },
                        v3: function (options) {
                            return options.path === 'v3';
                        },
                    },
                }, 'v1: payload')
                .addVertex({
                    name: 'v2',
                    next: 'v3',
                }, 'v2:payload')
                .addVertex({
                    name: 'v3',
                }, 'v3:payload')
                .startAtVertex('v1')
                .addActionBuilder(actionBuilderFn)
                .addActionBuilder(actionBuilderFn)  // Yes, we're testing adding multiples :)
                .whenFinished(whenFinishedFn)
                .whenFinished(whenFinishedFn)   // Same as above here
                .build();
        });

        it('should create a graph matching definition', function () {
            var graph = flow.getGraph();
            expect(graph.getAllVertexNames()).toEqual(['v1', 'v2', 'v3']);
            expectEdgesMatch(graph, {
                'v1': [ 'v2', 'v3' ],
                'v2': 'v3',
            });
            expect(graph.getSourceName()).toEqual('v1');
        });

        it('should inject action builders and finished functions', function () {
            expect(flow.getActionBuilderFunctions()).toEqual([
                actionBuilderFn,
                actionBuilderFn,
            ]);
            expect(flow.getWhenFinishedFunctions()).toEqual([
                whenFinishedFn,
                whenFinishedFn,
            ]);
        });
    });
});
