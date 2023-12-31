const Team = require("../models/TeamModel")
const Ticket = require("../models/TicketModel");
const User = require("../models/UserModel");
class TicketService {

    static async create(teamId, ticketData) {
        try {
            const team = await Team.findByPk(teamId);
            const ticket = await Ticket.create(ticketData);

            ticket.team_id = team.id;

            await ticket.save();
            await team.update({ ...team, backlog: [...team.backlog, ticket.id] });

            return team
        } catch (error) {
            console.log(error)
            throw new Error(error.message)
        }
    }

    static async assignUser(userId, ticketId) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found.');
            }

            const ticket = await Ticket.findByPk(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found.');
            }

            ticket.owner_id = user.id;
            await ticket.save();

            return `user ${user.username} assigned to task ${ticket.id}`
        } catch (error) {
            console.log(error)
            throw new Error(error.message)
        }
    }
}

module.exports = TicketService;