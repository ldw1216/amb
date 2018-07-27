const ParcelBundler = require('parcel')
const express = require('express')
const proxy = require('http-proxy-middleware')
const part = Number(process.env.UI_PORT || 1234)

const parcel = new ParcelBundler(require('path').resolve('client', 'index.html'), {})
const app = express()

app.use('/api', proxy({ target: 'http://localhost:3000' }))
app.use(parcel.middleware())
app.listen(part, () => console.log('\n Client created: / -> http://localhost:' + part))
