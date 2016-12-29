<img src="docs/flow_banner.png" height="48" align="left">
# Flow

[![Build Status](https://travis-ci.org/kgarsjo/Flow.svg?branch=master)](https://travis-ci.org/kgarsjo/Flow)

> An action-driven traverser of directed graphs

## What does Flow do?

Flow describes directed graphs - a collection of vertices and one-way edges. It allows you to traverse a described graph by following the edges, and to trigger actions for every vertex you encounter along the way.

## How might I use it?

Here's an example that uses flows to sequentially change the background color of a webpage:

```javascript
var Flow = require('flow');

var ColorAction = Flow.Action.extend({
    start: function () {
        document.body.style.backgroundColor = this.payload;
    },
});

var colorFlow = new Flow.Builder()
    .addVertex({ name: 'color1', next: 'color2' }, 'red')
    .addVertex({ name: 'color2', next: 'color3' }, 'blue')
    .addVertex({ name: 'color3' }, 'green')
    .addActionBuilder(function (flow, color) {
        return new ColorAction({
            flow: flow,
            payload: color,
        });
    })
    .whenFinished(function () {
        document.body.style.backgroundColor = gray;
        document.body.text = 'Done!';
    })
    .build();

colorFlow.start();
```

Test out an enhanced version of this example below:

<iframe height='265' scrolling='no' title='Color Flow' src='//codepen.io/kgarsjo/embed/vyoGEy/?height=265&theme-id=dark&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/kgarsjo/pen/vyoGEy/'>Color Flow</a> by Kevin Garsjo (<a href='http://codepen.io/kgarsjo'>@kgarsjo</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

## Installation

If you haven't already, install [Yarn](https://yarnpkg.com/en/docs/install).

To install Flow, run `yarn`.

To build, run `yarn build`.

To test, run `yarn test`.
