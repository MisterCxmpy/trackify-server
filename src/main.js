const express = require('express');
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')

const validateToken = require('./middleware/validateToken');

const AuthRouter = require('./routes/AuthRouter');
const TeamRouter = require('./routes/TeamRouter');
const UserRouter = require('./routes/UserRouter');

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true })) // add your client domain in here like { origin: 'http://localhost:5172' }

app.use('/auth', AuthRouter)
app.use('/teams', validateToken, TeamRouter)
app.use('/me', validateToken, UserRouter)

// currently can:
// create account, login
// create teams and query teams for their associated members
// assign people to a team or join a team yourself, either via the friend code or by a request via that team's id
// create simple tasks on a team and push them to a backlog

// need to:
// add user role elevation requests and validate roles more frequently for effective authorization

// assign tickets to members
// edit state of tickets and reassign them to new members

// extract route logic to controllers

app.get('/', (req, res, next) => {
    res.json({ message: 'ok. api is working' })
})

module.exports = app;
