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

## Functions

- [`constructor`](#user-content-constructor)

- [`extend`](#user-content-extend)

- [`next`](#user-content-next)

- [`setFlow`](#user-content-set-flow)

- [`start`](#user-content-start)

# Definitions

## `flow`
(Flow): The `Flow` to which this action belongs.

## `constructor`
Creates a new `Action`.

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
var ReplaceHistoryAction = Flow.Action.extend({
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

## `setFlow`
Parameters:
- `Flow:flow`. The flow this action belongs to

The `setFlow` function will be called when the action is registered to a flow.

Example:
```javascript
action.start(payload);
```

## `start`
Parameters:
- `object:payload`. The payload to act upon.

The `start` function will be called when a vertex is traversed. Override `start` to do something important to your domain logic whenever a new traversal happens.

Example:
```javascript
action.start(payload);
```
