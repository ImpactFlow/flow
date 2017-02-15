'use strict';

var Action = require('../lib/action');

describe('action', function () {
    var action;
    var flow;
    var payload;

    beforeEach(function () {
        flow = {
            next: jasmine.createSpy(),
        };
        payload = {};
        action = new Action();
        action.setFlow(flow);
    });

    it('should exist', function () {
        expect(action).toBeDefined();
    });

    describe('when calling next', function () {
        it('should call next on the passed flow', function () {
            action.next();
            expect(flow.next).toHaveBeenCalled();
        });
    });

    describe('when calling start', function () {
        it('should throw no error', function () {
            action.start(payload);
        });
    });
});
