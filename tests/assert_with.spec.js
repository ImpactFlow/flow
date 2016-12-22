'use strict';

var assertWith = require('../lib/assert_with');

describe('assert_with', function () {
    var target;
    beforeEach(function () {
        target = {
            foo: 'foo',
        };
    });

    describe('when calling expect', function () {
        describe('with a falsy conditionalFn', function () {
            it('should throw error with errorMessage', function () {
                var conditionalFn = jasmine.createSpy().and.returnValue(false);
                var tryFn = function () {
                    assertWith(target).expect(conditionalFn, 'Fail');
                };
                expect(tryFn).toThrowError('Fail');
                expect(conditionalFn).toHaveBeenCalledWith(target);
            });
        });

        describe('with a truthy conditionalFn', function () {
            it('should return asserter', function () {
                var conditionalFn = jasmine.createSpy().and.returnValue(true);
                var result = assertWith(target).expect(conditionalFn, 'Fail');
                expect(result.get()).toEqual(target);
            });
        });
    });

    describe('when calling expectProperty', function () {
        describe('with an existing property', function () {
            it('should throw error with errorMessage', function () {
                var result = assertWith(target).expectProperty('foo', 'Fail');
                expect(result.get()).toEqual(target);
            });
        });

        describe('with no existng property', function () {
            it('should throw error with errorMessage', function () {
                var tryFn = function () {
                    assertWith(target).expectProperty('notthere', 'Fail');
                };
                expect(tryFn).toThrowError('Fail');
            });
        });
    });
});
