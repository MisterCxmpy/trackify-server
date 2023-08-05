const Team = require('../models/TeamModel');

class TeamService {
    static async createTeam(teamData) {
        try {
            const newTeam = await Team.create(teamData);
            return newTeam;
        } catch (error) {
            throw new Error('Team creation failed.');
        }
    }

    static async addMemberToTeam(teamId, memberId) {
        try {
            const team = await Team.findByPk(teamId);
            if (!team) {
                throw new Error('Team not found.');
            }

            // Assuming you have a 'user' association in your Team model
            await team.addUser(memberId);

            return 'Member added to team successfully.';
        } catch (error) {
            throw new Error('Adding member to team failed.');
        }
    }

    static async addToBacklog(teamId, ticketId) {
        try {
            const team = await Team.findByPk(teamId);
            if (!team) {
                throw new Error('Team not found.');
            }

            // Update the backlog array by pushing the ticketId
            team.backlog.push(ticketId);

            // Save the updated team
            await team.save();

            return 'Ticket added to backlog successfully.';
        } catch (error) {
            throw new Error('Adding ticket to backlog failed.');
        }
    }


    // Add other methods as needed

}

module.exports = TeamService;
