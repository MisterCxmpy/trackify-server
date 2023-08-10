const router = require('express').Router();
const UserService = require('../services/UserService');


router.get('/', async (req, res) => {
    try {
        res.json(req.user)
    } catch (error) {
        console.log(error)
        res.json({ message: error.message })
    }
})

router.get('/teams', async (req, res) => {
    try {
        const teams = await UserService.getUserTeams(req.userId)

        res.json(teams)
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