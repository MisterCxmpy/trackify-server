const { Op } = require('sequelize');
const Team = require('../models/TeamModel');
const User = require('../models/UserModel');
const Ticket = require('../models/TicketModel');

class TeamService {

    static scrubTeamResponse(data) {
        return {
            id: data.id,
            team_name: data.team_name,
            backlog: data.backlog,
            members: data.Users?.map(user => {
                return {
                    id: user.id,
                    username: user.username,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                };
            })
        }
    }

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
                include: {
                    model: User,
                    attributes: { exclude: ['password', 'id', 'updatedAt'] } // Exclude the 'password' attribute
                },
            });

            return allTeams.map(this.scrubTeamResponse);
        } catch (error) {
            console.error(error)
            throw new Error('Team Query Failed.');
        }
    }

    static async find(id) {
        try {
            const teams = await Team.findAll({
                where: { id: { [Op.eq]: id } },
                include: { model: User, attributes: { exclude: ['password', 'id', 'updatedAt'] } },
                limit: 1
            });

            return this.scrubTeamResponse(teams[0]);
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

    static async getMemberTasks(teamId, memberId) {
        try {
            const team = await Team.findByPk(teamId);
            const backlog = team.backlog;

            const filtered = backlog.filter(ticket => ticket.owner === memberId);

            return filtered;

        } catch (error) {
            console.error(error)
            throw new Error('Failed to query backlog.');
        }
    }

    static async getBacklog(teamId) {
        try {
            const team = await Team.findByPk(teamId);
            const backlog = team.backlog;

            const tickets = await Ticket.findAll({
                where: {
                    id: {
                        [Op.in]: backlog // Use the $in operator to match any ID in the array
                    }
                },
                attributes: {
                    exclude: 'team_id'
                }
            });

            return tickets;

        } catch (error) {
            console.log(error)
            throw new Error('Failed to query backlog.');
        }
    }

}

module.exports = TeamService;
