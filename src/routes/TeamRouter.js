const router = require('express').Router();
const TeamService = require('../services/TeamService');

// DEV OPERATIONS

router.get('/', async (req, res) => {
    try {
        const teams = await TeamService.findAll();

        res.json(teams)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


// Team CRUD Operations

router.post('/new', async (req, res) => {
    try {
        const newTeam = await TeamService.createTeam(req.body);
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create team.' });
    }
});

router.get('/:teamId', async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const teamDetails = await TeamService.find(teamId);
        res.json(teamDetails);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch team details.' });
    }
});

router.patch('/:teamId', async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const updatedTeam = await TeamService.updateTeam(teamId, req.body);
        res.json(updatedTeam);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update team.' });
    }
});

router.delete('/:teamId', async (req, res) => {
    try {
        const teamId = req.params.teamId;
        await TeamService.deleteTeam(teamId);
        res.json({ message: 'Team deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete team.' });
    }
});

// Team Tickets CRUD Operations

router.get('/:teamId/tasks', async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const teamTasks = await TeamService.getTeamTasks(teamId);
        res.json(teamTasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch team tasks.' });
    }
});

router.get('/:teamId/:memberId/tasks', async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const memberId = req.params.memberId;
        const memberTasks = await TeamService.getMemberTasks(teamId, memberId);
        res.json(memberTasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch member tasks.' });
    }
});

module.exports = router;
