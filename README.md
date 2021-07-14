# ngraph.hits [![build status](https://github.com/anvaka/ngraph.hits/actions/workflows/tests.yaml/badge.svg)](https://github.com/anvaka/ngraph.hits/actions/workflows/tests.yaml)

Hubs and authorities (HITS) algorithm for [`ngraph.graph`](https://github.com/anvaka/ngraph.graph).
HITS algorithm is a link analysis algorithm, which assigns each graph node two
scores:

* authority - estimates the value of a node
* hub - estimates the value of outgoing links from a node

See more details about algorithm here: [Hyperlink-Induced Topic Search](https://en.wikipedia.org/wiki/HITS_algorithm).

# usage

``` js
// let's say we have a graph with just one link: a -> b
var graph = require('ngraph.graph')();
graph.addLink('a', 'b');

// let's compute ranks for each node:
var hits = require('ngraph.hits');
var result = hits(graph);
```

Now `result` will be an object with the following values:

``` js
{
  "a": {
    "authority": 0,
    "hub": 1
  },
  "b": {
    "authority": 1,
    "hub": 0
  }
}
```

By default the algorithm will compute ranks values with `1e-8` precision. You
can configure this by passing optional argument:

``` js
var precision = 1e-5;
hits(graph, precision); // compute with 1e-5 precision
```

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.hits
```

# license

MIT
