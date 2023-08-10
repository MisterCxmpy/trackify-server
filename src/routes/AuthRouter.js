const router = require('express').Router();
const AuthService = require('../services/AuthService');
const UserService = require('../services/UserService');

const validateToken = require('../middleware/validateToken')

const TWO_HOURS = 1000 * 60 * 60 * 2; // move to config file later

router.post('/login', async (req, res) => {
    try {
        const user = await AuthService.authenticateUser(req.body); // attempt login
        const token = AuthService.createToken(user.id);

        res.cookie('token', token, { maxAge: TWO_HOURS }) // move to config file later
        res.json({ message: 'Succesfully Logged in.' });
    } catch (error) {
        console.log(error)
        res.json({ message: error.message })
    }
})

router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await AuthService.hashPass(req.body.password)
        console.log(req.body)
        const user = await UserService.create({ ...req.body, password: hashedPassword });
        const token = AuthService.createToken(user.id);

        res.cookie('token', token, { maxAge: TWO_HOURS }) // move to config file later
        res.json({ message: 'Succesfully Registered.' });
    } catch (error) {
        console.log(error)
        res.json({ message: error.message })
    }
})

router.get('/team-permissions/:teamId', validateToken, async (req, res) => {
    const team = req.params.teamId;
    const user = req.userId;
    try {

        // Determine the team-specific permissions based on user role and team
        const teamPermissions = await AuthService.calculateTeamPermissions(user, team);

        // Generate a team-specific token with the calculated permissions
        const teamToken = AuthService.createTeamToken(teamPermissions);

        res.json({ teamToken });
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
});

module.exports = router;