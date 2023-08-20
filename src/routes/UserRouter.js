const router = require('express').Router();
const UserService = require('../services/UserService');

router.get('/', async (req, res) => {
    try {
        res.json({ ...req.user, id: null })
    } catch (error) {
        console.log(error)
        res.json({ message: error.message })
    }
})

router.get('/teams', async (req, res) => {
    try {
        const teams = await UserService.getUserTeams(req.user.id)

        res.json(teams)
    } catch (error) {
        console.log(error)
        res.json({ message: error.message })
    }
})


module.exports = router;