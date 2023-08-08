const router = require('express').Router();
const UserService = require('../services/UserService');


router.get('/', async (req, res) => {
    try {
        const user = await UserService.query(req.userId)

        res.json(user)
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


module.exports = router;