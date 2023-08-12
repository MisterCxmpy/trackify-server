const User = require("../models/UserModel");
const Team = require("../models/TeamModel")
const Ticket = require("../models/TicketModel");
class TicketService {

    static async create(teamId, ticketData) {
        try {
            const ticket = await Ticket.create({ ...ticketData, team_id: teamId });

            return ticket
        } catch (error) {
            console.log(error)
            throw new Error(error.message)
        }
    }

    static async find(teamId, ticketId) {
        try {
            const ticket = await Ticket.findOne({ where: { team_id: teamId, id: ticketId }, attributes: { exclude: ['team_id'] } });

            if (!ticket) throw new Error('No ticket found')

            return ticket
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