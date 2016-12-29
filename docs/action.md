# Action

> [lib/action.js](https://github.com/kgarsjo/flow/blob/master/lib/action.js)

An `Action` consumes the payload of a traversed `Vertex` and does something desireable with it. `Action`s are attached to flows via `Builder`s.

`Action`s capture the intersection between flows and your domain logic, so they are designed to be extended and customized.

As an example, here is a custom action that replaces the browser url with a `path` value set on each vertex of the flow:

```javascript
var ReplaceHistoryAction = Action.extend({
    start: function () {
        var path = this.payload.path;
        window.location.replace(path);
    },
});
```

## Properties

- [`flow`](#user-content-flow)

- [`payload`](#user-content-payload)

## Functions

- [`constructor`](#user-content-constructor)

- [`extend`](#user-content-extend)

- [`next`](#user-content-next)

- [`start`](#user-content-start)

# Definitions

## `flow`
(Flow): The `Flow` to which this action belongs.

## `payload`
(any): The data this action will use.

## `constructor`
Creates a new `Action`. The action instances are expected to be created internally by `Flow`s as the graph is traversed, so this should only be called manually for customized solutions.

Parameters:
- `object:options`. Options recognized are `flow` (required) and `payload`.

Example:
```javascript
var action = new Action({
    flow: flow,
    payload: { foo: 'bar' },
});
```

## `extend`
Paramters:
- `object:prototypeFragment`, a map of properties which should be extended onto a new subclass of `Action`.

Returns a new Type which subclasses `Action` using the given prototype fragment.

Example:
```javascript
var ReplaceHistoryAction = Action.extend({
    start: function () {
        var path = this.payload.path;
        window.location.replace(path);
    },
});
```

## `next`
Triggers the parent flow to visit the next vertex

Example:
```javascript
action.next();
```

## `start`
The `start` function will be called when a vertex is traversed. Override `start` to do something important to your domain logic whenever a new traversal happens.

Example:
```javascript
action.start();
```
