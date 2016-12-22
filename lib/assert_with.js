'use strict';

module.exports = function assertWith (target) {
    return {
        expect: function (conditionalFn, errorMessage) {
            if (conditionalFn(target)) {
                return this;
            }
            throw new Error(errorMessage);
        },

        expectProperty: function (propertyName, errorMessage) {
            return this.expect(function (target) {
                return target && target[propertyName];
            }, errorMessage);
        },

        get: function () {
            return target;
        },
    };
};
