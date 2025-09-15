import { dbContext } from "../db/DbContext.js";


class TicketsService {
    
  async createTicket(ticketData) {
    const ticket = await dbContext.Tickets.create(ticketData);
    await ticket.populate('event');
    await ticket.populate('profile', 'name picture');
    return ticket;
  }

  async getTicketsByEventId(eventID) {
    const tickets = await dbContext.Tickets.find({ eventId: eventID }).populate('profile', 'name picture');
    return tickets;
  }

  async deleteTicket(ticketId, accountId) {
    const ticket = await dbContext.Tickets.findById(ticketId).populate('profile', 'name picture'); //Is the populate setup correctly?
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    if (ticket.accountId != accountId) {
      throw new Error('You do not have permission to delete this ticket');
    }
    await ticket.deleteOne();

    return `Ticket with id ${ticketId} has been deleted.`;
  }

  async getTicketsByAccountId(accountID) {
    const tickets = await dbContext.Tickets.find({ accountId: accountID }).populate('event');
    return tickets;
  }
}

export const ticketService = new TicketsService();