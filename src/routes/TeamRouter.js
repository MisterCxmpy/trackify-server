const router = require('express').Router();
const TeamService = require('../services/TeamService');
const TicketService = require('../services/TicketService');
const UserService = require('../services/UserService');

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

router.post('/', async (req, res) => {
    try {
        const newTeam = await TeamService.createTeam(req.body);
        await TeamService.addMemberToTeam(newTeam.id, req.user.id, 'administrator');
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:teamId', async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const teamDetails = await TeamService.find(teamId);
        res.json(teamDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

// Team Memebrs Operations

router.get('/:teamId/join', async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const teamDetails = await TeamService.addMemberToTeam(teamId, req.user.id);

        res.json(teamDetails);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch team details.' });
    }
});

router.get('/:teamId/leave', async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const teamDetails = await TeamService.removeMemberFromTeam(teamId, req.user.id);

        res.json(teamDetails);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Failed to fetch team details.' });
    }
});

router.get('/:teamId/add/:friendCode', async (req, res) => {
    try {
        const user = await UserService.queryFC(req.params.friendCode)
        const team = await TeamService.addMemberToTeam(req.params.teamId, user.id)

        res.json(team)
    } catch (error) {
        res.json({ message: error.detail })
    }
})

router.get('/:teamId/remove/:friendCode', async (req, res) => {
    try {
        const user = await UserService.queryFC(req.params.friendCode)
        const team = await TeamService.removeMemberFromTeam(req.params.teamId, user.id)

        res.json(team)
    } catch (error) {
        res.json({ message: error.detail })
    }
})

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

router.post('/:teamId/tasks', async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const team = await TicketService.create(teamId, req.body);

        res.json(team);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch team tasks.' });
    }
});

router.get('/:teamId/tasks/:taskId', async (req, res) => {
    const teamId = req.params.teamId;
    const taskId = req.params.taskId;

    try {
        const teamTickets = await TicketService.find(teamId, taskId);

        res.json(teamTickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
