const express = require('express');
const app = express()

const AuthRouter = require('./routes/AuthRouter')
const TeamRouter = require('./routes/TeamRouter')

app.use(express.json())

app.use('/auth', AuthRouter)
app.use('/teams', TeamRouter)

// currently can create teams and query teams for their associated members

// need to:

// add members to team
// remove members from team

// add tickets to backlog and assign them to members
// edit state of tickets and reassign them to new members

// extract route logic to controllers
// restrict access to services

app.get('/', (req, res, next) => {
    res.json({ message: 'ok. api is working' })
})

module.exports = app;