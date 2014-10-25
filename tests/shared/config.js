'use strict';

var helpers = require('../helpers');
var harness = helpers.harness(__filename);
var nano = harness.locals.nano;
var Nano = helpers.Nano;

var it = harness.it;

it('should serve the root when no path is specified', function(assert) {
  nano.dinosaur('', function(err, response) {
    assert.equal(err, null, 'failed to get root');
    assert.ok(response.version, 'version is defined');
    nano.relax(function(err, response) {
      assert.equal(err, null, 'relax');
      assert.ok(response.version, 'had version');
      assert.end();
    });
  });
});

it('should be able to parse urls', function(assert) {
  var baseUrl = 'http://someurl.com';
  assert.equal(
    Nano(baseUrl).config.url,
    baseUrl,
    'simple url');

  assert.equal(
    Nano(baseUrl + '/').config.url,
    baseUrl + '/',
    'simple with trailing');

  assert.equal(
    Nano('http://a:b@someurl.com:5984').config.url,
    'http://a:b@someurl.com:5984',
    'with authentication');

  //var withDb = Nano({
  //  url: 'http://a:b@someurl.com:5984',
  //  db: 'foo'
  //})

  //assert.equal(withDb.config.db, 'foo', 'should create url with db');
  //assert.ok(withDb.attachment, 'should have an attachment');

  assert.equal(
    Nano('http://a:b%20c%3F@someurl.com:5984/mydb').config.url,
    'http://a:b%20c%3F@someurl.com:5984',
    'with escaped auth');

  assert.equal(
    Nano(baseUrl + ':5984/a').config.url,
    baseUrl + ':5984',
    'with port');

  assert.equal(
    Nano(baseUrl + '/a').config.url,
    baseUrl,
    '`a` database');

  assert.end();
});

it('should accept and handle customer http headers', function(assert) {
  var nanoWithDefaultHeaders = Nano({
    url: helpers.couch,
    defaultHeaders: {
      'x-custom-header': 'custom',
      'x-second-header': 'second'
    }
  });

  var req = nanoWithDefaultHeaders.db.list(function(err) {
    assert.equal(err, null, 'should list');
    assert.end();
  });

  assert.equal(
    req.headers['x-custom-header'],
    'custom',
    'header `x-second-header` honored');

  assert.equal(
    req.headers['x-second-header'],
    'second',
    'headers `x-second-header` honored');
});

it('should prevent shallow object copies', function(assert) {
  var config = {
    url: 'http://someurl.com'
  };

  assert.equal(
    Nano(config).config.url,
    config.url,
    'simple url');

  assert.ok(
    Nano(config).config.requestDefaults,
    '`requestDefaults` should be set');
  assert.ok(!config.requestDefaults,
    'should not be re-using the same object');

  assert.end();
});
