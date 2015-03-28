var test = require('tap').test;
var fromDot = require('ngraph.fromdot');
var hits = require('../');

test('it calculates hubs and authorities for a graph', function(t) {
  // This graph was comupted in the book http://www.mmds.org/ in Example 5.15.
  // Let's check our answers
  var graph = fromDot([
    'digraph G {',
    'a -> {b c d}',
    'b -> {a d}',
    'c -> e',
    'd -> {b c}',
    '}'].join('\n'));

  var result = hits(graph);
  areClose(result.a.authority, 0.2087, 'a authoirty is correct');
  areClose(result.a.hub, 1, 'a hub is correct');

  areClose(result.b.authority, 1, 'b authoirty is correct');
  areClose(result.b.hub, 0.3583, 'b hub is correct');

  areClose(result.c.authority, 1, 'c authoirty is correct');
  areClose(result.c.hub, 0, 'c hub is correct');

  areClose(result.d.authority, 0.7913, 'd authoirty is correct');
  areClose(result.d.hub, 0.7165, 'd hub is correct');

  areClose(result.e.authority, 0, 'e authoirty is correct');
  areClose(result.e.hub, 0, 'e hub is correct');
  t.end();

  function areClose(value, expected, message) {
    var diff = Math.abs(expected - value);
    t.ok(diff <= 1e-4, message);
  }
});
