'use strict'

process.nextTick = require('process.nexttick')

var assert   = require('assert'),
    test     = require('tap'),
    Handover = require('hand-over'),
    Plugin   = require('./'),
    pending  = 8,
    data     = null,
    fail     = false,
    opts     = {
        address:    get('address'),
        cert:       get('certificate'),
        key:        get('key'),
        passphrase: get('passphrase'),
        fastMode:   true
    },
    p = new Plugin(opts),
    n = new Handover().use(p)

function get(key) {
    key = 'HANDOVER_APNS_TEST_' + key.toUpperCase()

    var val = process.env[ key ]
    assert(val, '"' + key + '" environment variable not set')
    return val
}


function done() {
    if(--pending)
        return

    n.unref()
    p.destroy()
}

function success(err) {
    test.notOk(err, 'notification should be sent out successfully')
    done()
}

function error(err) {
    test.ok(err, 'notification should _not_ be sent out successfully')
    done()
}

n.load = function (userId, channel, callback) {
    if (fail)
        callback(null, fail)
    else
        callback(null, get('token'))
}

test.plan(9)

n.send('test', data, success)

data = {}
n.send('test', data, success)

data.expiry = Math.floor(Date.now() / 1000) + 3600 // 1 hour
n.send('test', data, success)

data.count = 0
n.send('test', data, success)

data.sound = 'ping.aiff'
n.send('test', data, success)

data.alert = 'Handover APNS test passed!'
n.send('test', data, success)

data.payload = { test: 'test' }
n.send('test', data, success)

// exception
fail = 'invalid token'
n.send('test', data, error)

test.test('error handler', function (test) {
    test.plan(6)

    n.once('error', function (err) {
        test.ok(err, 'error should present')
        test.equal(err.channel, 'apns', 'error should be decorated with channel')
        test.notOk(err.target, 'error should _not_ be decorated with target')
    })
    p.onError(new Error('test'))

    n.once('error', function (err) {
        test.ok(err, 'error should present')
        test.equal(err.channel, 'apns', 'error should be decorated with channel')
        test.equal(err.target, 'babe', 'error should be decorated with target')
    })
    p.onError(new Error('test'), null, { token: 47806 })
})
