const router = require('express').Router();
const requireTeamPermissions = require('../middleware/requireTeamPermissions');
const AuthService = require('../services/AuthService');
const TeamService = require('../services/TeamService');
const TicketService = require('../services/TicketService');
const UserService = require('../services/UserService');


const TWO_HOURS = 1000 * 60 * 60 * 2; // move to config file later
const SAME_SITE = 'lax'

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
        const newTeam = await TeamService.createTeam(req.body); // create team off of user body
        await TeamService.addMemberToTeam(newTeam.id, req.user.id, 'administrator'); // add user as admin
        const { perms } = await AuthService.calculateTeamPermissions(req.user.id, newTeam.id) // calculate users permissions
        const authToken = AuthService.createTeamToken(perms) // generate token for calculated permissions

        res.cookie('teamToken', authToken, { sameSite: SAME_SITE, maxAge: TWO_HOURS }) // set teamToken
        res.status(201).json(newTeam); // return new team data
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:teamId', requireTeamPermissions(['read-limited']), async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const teamDetails = await TeamService.find(teamId);

        if (!teamDetails) {
            return res.status(404).json({ message: "Team not found" });
        }

        res.json(teamDetails);
    } catch (error) {
        console.error("An error occurred:", error);

        res.status(500).json({ message: "An unexpected error occurred" });
    }
});


router.patch('/:teamId', requireTeamPermissions(['write']), async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const updatedTeam = await TeamService.updateTeam(teamId, req.body);

        res.json(updatedTeam);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update team.' });
    }
});

router.delete('/:teamId', requireTeamPermissions(['delete']), async (req, res) => {
    try {
        const teamId = req.params.teamId;
        await TeamService.deleteTeam(teamId);
        res.json({ message: 'Team deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete team.' });
    }
});

// Team Memebrs Operations

router.get('/:teamId/leave', async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const teamDetails = await TeamService.removeMemberFromTeam(teamId, req.user.id);

        res.json(teamDetails);
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
});

router.get('/:teamId/perms', requireTeamPermissions(['read']), async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const permissions = await AuthService.calculateTeamPermissions(req.user.id, teamId);

        res.json({ user: req.user.username, ...permissions });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
});

router.get('/:teamId/add/:friendCode', requireTeamPermissions(['manage-users']), async (req, res) => {
    try {
        const user = await UserService.queryFC(req.params.friendCode)
        const team = await TeamService.addMemberToTeam(req.params.teamId, user.id)

        res.json(team)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/:teamId/remove/:friendCode', requireTeamPermissions(['manage-users']), async (req, res) => {
    try {
        const user = await UserService.queryFC(req.params.friendCode)
        const team = await TeamService.removeMemberFromTeam(req.params.teamId, user.id)

        res.json(team)
    } catch (error) {
        res.json({ message: error.message })
    }
})

router.get('/:teamId/members', requireTeamPermissions(['read']), async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const teamTasks = await TeamService.getMembers(teamId);
        res.json(teamTasks);
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
});

// Team Tickets Operations

router.get('/:teamId/tasks', requireTeamPermissions(['read']), async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const teamTasks = await TeamService.getBacklog(teamId);
        res.json(teamTasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:teamId/tasks', requireTeamPermissions(['write', 'read']), async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const team = await TicketService.create(teamId, req.body);

        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:teamId/tasks/:taskId', requireTeamPermissions(['read']), async (req, res) => {
    const teamId = req.params.teamId;
    const taskId = req.params.taskId;

    try {
        const teamTickets = await TicketService.find(teamId, taskId);

        res.json(teamTickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:teamId/:memberId/tasks', requireTeamPermissions(['read']), async (req, res) => {
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
