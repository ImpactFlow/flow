'use strict';

var extend = require('../lib/extend');

describe('extend', function () {
    var Animal = function () {
        this.name = 'Animal';
        this.type = 'Mammal';
    };
    Animal.prototype.isCalled = function () {
        return this.name;
    };
    Animal.prototype.isType = function () {
        return this.type;
    };
    Animal.prototype.livesOn = function () {
        return 'Earth';
    };
    Animal.prototype.makesSound = function () {
        return 'Generic Animal Sound';
    };

    var Cow;
    var instance;

    describe('when extending without a prototype fragment', function () {
        beforeEach(function () {
            Cow = extend(Animal);
            instance = new Cow();
        });

        it('should call through to superclass', function () {
            expect(instance.livesOn()).toEqual('Earth');
            expect(instance.makesSound()).toEqual('Generic Animal Sound');
        });
    });

    var assertCommonBehavior = function () {
        it('should not add new properties onto superclass', function () {
            expect(Animal.prototype.turnsInto).not.toBeDefined();
        });

        it('should add new properties onto subclass', function () {
            expect(Cow.prototype.turnsInto).toBeDefined();
        });

        it('should call original constructor even if subclass initialize has been provided', function () {
            expect(instance.isType()).toEqual('Mammal');
        });

        it('should use overriding functions on subclass instance', function () {
            expect(instance.makesSound()).toEqual('Moo');
        });

        it('should not clobber overriding properties on superclass', function () {
            expect(Animal.prototype.makesSound.apply(instance)).toEqual('Generic Animal Sound');
        });

        it('should call through to superclass when property is not overridden', function () {
            expect(instance.livesOn()).toEqual('Earth');
        });
    };

    describe('when extending without constructor', function () {
        beforeEach(function () {
            Cow = extend(Animal, {
                makesSound: function () {
                    return 'Moo';
                },
                turnsInto: function () {
                    return 'Tasty Beef';
                },
            });
            instance = new Cow();
        });
        assertCommonBehavior();
    });

    describe('when extending with constructor', function () {
        beforeEach(function () {
            Cow = extend(Animal, {
                initialize: function () {
                    this.name = 'Dairy Cow';
                },
                makesSound: function () {
                    return 'Moo';
                },
                turnsInto: function () {
                    return 'Tasty Beef';
                },
            });
            instance = new Cow();
        });
        assertCommonBehavior();

        it('should call the supplied constructor function on new', function () {
            expect(instance.isCalled()).toEqual('Dairy Cow');
        });
    });
});
