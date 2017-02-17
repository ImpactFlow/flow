<img src="docs/flow_banner.png" height="48" align="left">
# Flow

[![Build Status](https://travis-ci.org/ImpactFlow/flow.svg?branch=master)](https://travis-ci.org/ImpactFlow/flow) [![Coverage Status](https://coveralls.io/repos/github/kgarsjo/Flow/badge.svg?branch=master)](https://coveralls.io/github/kgarsjo/Flow?branch=master)

> An action-driven traverser of directed graphs

# What does Flow do?

Flow describes directed graphs - a collection of vertices and one-way edges. It allows you to traverse a described graph by following the edges, and to trigger actions for every vertex you encounter along the way.

# How might I use it?

Here's an example that uses flows to sequentially change the background color of a webpage:

```javascript
var Flow = require('flow');

var ColorAction = Flow.Action.extend({
    start: function (color) {
        document.body.style.backgroundColor = color;
    },
});

var colorFlow = new Flow.Builder()
    .addVertex({ name: 'color1', next: 'color2' }, 'red')
    .addVertex({ name: 'color2', next: 'color3' }, 'blue')
    .addVertex({ name: 'color3' }, 'green')
    .addAction(new ColorAction())
    .whenFinished(function () {
        document.body.style.backgroundColor = gray;
        document.body.text = 'Done!';
    })
    .build();

colorFlow.start();
```

Test out an [enhanced version of this example](http://codepen.io/kgarsjo/full/vyoGEy/) on CodePen.

# What else can I do with it?

- Wrap a view library inside an Action, and you can drive your user interactions via flows. For example, see [Marionette.Flow](https://github.com/kgarsjo/marionette.flow).

- Drive a storyline for a Role-playing Game by describing each story stage in vertices and edges.

- Build a map of interconnected rooms.

- Model and simulate a traffic network for a city.

# How do I use it in my project?

Flow is currently in a pre-release stage, so an NPM repository package hasn't been created yet (one should be on its way shortly!).

To use flow in a Node context from this GitHub repo, use either of the following:

```
npm install --save kgarsjo/flow#<version>
```

```
yarn add kgarsjo/flow#<version>
```

# Where's the Documentation?

Documentation is currently WIP. Here are some parts currently available:

Below are the Flow types that you **must** or **should** extend op consume to get value from the project:
- [Action](docs/action.md)
- [Builder](docs/builder.md)
- [Flow](docs/builder.md)

Below are the Flow types that you **can** extend for custom solutions, but are not required for use:
- [Edge](docs/edge.md)
- [Graph](docs/graph.md)
- [Vertex](docs/vertex.md)

# Installing from scratch

If you haven't already, install [Yarn](https://yarnpkg.com/en/docs/install).

To install Flow and its dependencies, run `yarn`.

To build the combined and minified distribution files, run `yarn build`.

To kick off the test suite, run `yarn test`.
