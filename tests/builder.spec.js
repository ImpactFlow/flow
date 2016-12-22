'use strict';

var Builder = require('../lib/builder');

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
            flow = builder.addVertex('v1', 'v1:payload', 'v2')
                .addVertex('v2', 'v2:payload', 'v3')
                .addVertex('v3', 'v3:payload')
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
            expect(graph.getAllEdges()).toEqual({
                'v1': 'v2',
                'v2': 'v3',
            });
            expect(graph.getSourceVertex()).toEqual('v1');
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
