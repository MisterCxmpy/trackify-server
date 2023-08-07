const express = require('express');
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')

const { validateToken } = require('./utils/validateToken');

const AuthRouter = require('./routes/AuthRouter');
const TeamRouter = require('./routes/TeamRouter');
const UserRouter = require('./routes/UserRouter');

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true })) // add your client domain in here like { origin: 'localhost:5172' }

app.use('/auth', AuthRouter)
app.use('/teams', validateToken, TeamRouter)
app.use('/me', validateToken, UserRouter)

// currently can create teams and query teams for their associated members

// need to:

// remove members from team

// assign tickets to members
// edit state of tickets and reassign them to new members

// extract route logic to controllers

app.get('/', (req, res, next) => {
    res.json({ message: 'ok. api is working' })
})

module.exports = app;