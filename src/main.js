const express = require('express');
const app = express()

const AuthRouter = require('./routes/AuthRouter')
const TeamRouter = require('./routes/TeamRouter')

app.use(express.json())

app.use('/auth', AuthRouter)
app.use('/teams', TeamRouter)

app.get('/', (req, res, next) => {
    res.json({ message: 'ok. api is working' })
})

module.exports = app;