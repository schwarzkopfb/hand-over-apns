'use strict'

var assert   = require('assert'),
    test     = require('tap'),
    Handover = require('hand-over'),
    n        = new Handover,
    opts     = {
        address:    get('address'),
        cert:       get('certificate'),
        key:        get('key'),
        passphrase: get('passphrase'),
        fastMode:   true
    }

function get(key) {
    key = 'HANDOVER_APNS_TEST_' + key.toUpperCase()

    var val = process.env[ key ]
    assert(val, '"' + key + '" environment variable not set')
    return val
}

test.plan(1)

n.load = function (userId, channel, callback) {
    callback(null, get('token'))
}

function done(err) {
    test.notOk(err, 'notification should be sent out successfully')
    n.unref()
}

n.use('./', opts)

n.send('test', {
    expiry:  Math.floor(Date.now() / 1000) + 3600, // 1 hour
    count:   42,
    sound:   'ping.aiff',
    alert:   'This is a test! #1',
    payload: { test: 'test' }
}, done)
