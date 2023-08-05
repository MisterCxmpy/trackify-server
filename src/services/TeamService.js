const { Op } = require('sequelize');
const Team = require('../models/TeamModel');
const User = require('../models/UserModel');

class TeamService {
    static async createTeam(teamData) {
        try {
            const newTeam = await Team.create(teamData);
            return newTeam;
        } catch (error) {
            console.log(error)
            throw new Error('Team creation failed.');
        }
    }

    static async findAll() {
        try {
            const allTeams = await Team.findAll({
                include: { model: User, as: 'members' },
            });

            return allTeams;
        } catch (error) {
            console.error(error)
            throw new Error('Team Query Failed.');
        }
    }

    static async find(id) {
        try {
            const teams = await Team.findAll({
                where: { id: { [Op.eq]: id } },
                include: { model: User, as: 'members' },
                limit: 1
            });

            return teams[0];
        } catch (error) {
            console.error(error)
            throw new Error('Team Query Failed.');
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
            console.error(error)
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
            console.error(error)
            throw new Error('Adding ticket to backlog failed.');
        }
    }

}

module.exports = TeamService;
