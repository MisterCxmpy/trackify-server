const express = require('express');
const app = express()

const AuthRouter = require('./routes/AuthRouter')

app.use(express.json())

app.use('/auth', AuthRouter)

app.get('/', (req, res, next) => {
    res.json({ message: 'ok. api is working' })
})

module.exports = app;