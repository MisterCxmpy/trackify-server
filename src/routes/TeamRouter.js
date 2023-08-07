const router = require('express').Router();
const TeamService = require('../services/TeamService');
const TicketService = require('../services/TicketService');

// DEV OPERATIONS

router.get('/', async (req, res) => {
    try {
        const teams = await TeamService.findAll();

        res.json(teams)
    } catch (error) {
        console.log(error)
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

router.get('/:teamId/join', async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const teamDetails = await TeamService.addMemberToTeam(teamId, req.userId);

        res.json(teamDetails);
    } catch (error) {
        console.log(error.message)
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

// Team Tickets Operations

router.get('/:teamId/tasks', async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const teamTasks = await TeamService.getBacklog(teamId);
        res.json(teamTasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch team tasks.' });
    }
});

router.post('/:teamId/tasks/new', async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const team = await TicketService.create(teamId, req.body);
        res.json(team);
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

// Team Memebrs Operations

router.get('/:teamId/members', async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const teamTasks = await TeamService.getMembers(teamId);
        res.json(teamTasks);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch team members.' });
    }
});

module.exports = router;
