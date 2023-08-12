const { Op } = require('sequelize');
const Team = require('../models/TeamModel');
const User = require('../models/UserModel');
const Ticket = require('../models/TicketModel');
const UserTeam = require('../models/UserTeamModel');

class TeamService {

    static scrubTeamResponse(data) {
        return {
            id: data.id,
            team_name: data.team_name,
            backlog: data.backlog,
            members: data.members?.map(user => {
                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.UserTeam?.role
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
            throw new Error({ error: error.message });
        }
    }

    static async findAll() {
        const exclude = ['password', 'id', 'updatedAt', 'createdAt', 'first_name', 'last_name'];

        try {
            const allTeams = await Team.findAll({
                include: {
                    model: User,
                    as: 'members',
                    attributes: { exclude } // Exclude the 'password' attribute
                },
                attributes: { exclude: ['backlog'] }
            });

            return allTeams.map(this.scrubTeamResponse);
        } catch (error) {
            console.error(error)
            throw new Error('Team Query Failed.');
        }
    }
    static async find(id) {
        const exclude = ['password', 'id', 'updatedAt', 'createdAt', 'first_name', 'last_name'];

        try {
            const team = await Team.findByPk(id, {
                include: [
                    {
                        model: User,
                        as: 'members',
                        attributes: { exclude },
                        through: { attributes: ['role'] }
                    },
                    {
                        model: Ticket, // Assuming you've imported the Ticket model
                        as: 'backlog', // This should match the alias you've defined in TeamModel
                        attributes: { exclude: ['team_id'] }
                    }
                ]
            });

            if (!team) {
                throw new Error('Team not found.');
            }

            return this.scrubTeamResponse(team);
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }


    static async addMemberToTeam(teamId, memberId, role = 'reader') {
        try {
            const team = await Team.findByPk(teamId);

            if (!team) {
                throw new Error('Team not found.');
            }

            await UserTeam.create({ UserId: memberId, TeamId: teamId, role });

            return 'Member added to team successfully.';
        } catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    static async removeMemberFromTeam(TeamId, UserId) {
        try {
            const team = await Team.findByPk(TeamId);
            if (!team) {
                throw new Error('Team not found.');
            }

            // Afind and delete the user team link
            await (await UserTeam.findOne({ where: { TeamId, UserId } })).destroy();

            return 'Member removed from team successfully.';
        } catch (error) {
            console.error(error);
            throw new Error('Removing member from team failed.');
        }
    }

    static async getMembers(teamId) {
        try {
            const team = await Team.findByPk(teamId, { include: { model: User, attributes: { exclude: ['id', 'updatedAt'] } } });
            const members = this.scrubTeamResponse(team).members;

            return members;

        } catch (error) {
            console.log(error)
            throw new Error('Failed to query backlog.');
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
