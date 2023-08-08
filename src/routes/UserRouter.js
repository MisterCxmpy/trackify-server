const router = require('express').Router();
const UserService = require('../services/UserService');


router.get('/', async (req, res) => {
    try {
        const user = await UserService.query(req.userId)

        const formatted = { ...user.dataValues }

        res.json(formatted)
    } catch (error) {
        console.log(error)
        res.json({ message: error.message })
    }
})

router.get('/teams', async (req, res) => {
    try {
        const teams = await UserService.getUserTeams(req.userId)

        res.json(teams.map(t => t.team_name))
    } catch (error) {
        console.log(error)
        res.json({ message: error.message })
    }
})

router.get('/friends', async (req, res) => {
    try {
        const friends = await UserService.getUserFriends(req.userId)

        res.json(friends.map(t => t.username))
    } catch (error) {
        console.log(error)
        res.json({ message: error.message })
    }
})


module.exports = router;