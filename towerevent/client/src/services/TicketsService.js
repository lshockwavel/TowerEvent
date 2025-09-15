import { logger } from "@/utils/Logger.js";
import { api } from "./AxiosService.js";
import { AppState } from "@/AppState.js";
import {TicketEvent, TicketProfile } from "@/models/Ticket.js";


class TicketsService {

    async createTicket(ticketData) {
        const response = await api.post('api/tickets', ticketData);
        logger.log('created ticket', response.data);

        const ticket = new TicketProfile(response.data);
        AppState.eventTicketProfiles.push(ticket);
    }

    async getAccountTickets() {
        const response = await api.get('account/tickets');
        logger.log('account tickets', response.data);
        AppState.accountTicketEvents = response.data.map(ticket => new TicketEvent(ticket));
    }

    async getTicketsByEventId(eventID) {
        const response = await api.get(`api/events/${eventID}/tickets`);
        logger.log('event tickets', response.data);
        
        AppState.eventTicketProfiles = response.data.map(ticket => new TicketProfile(ticket));
    }

    async deleteTicket(ticketId) {
        const response = await api.delete(`api/tickets/${ticketId}`);
        logger.log('Deleted Ticket', response.data);

        const index = AppState.accountTicketEvents.findIndex(t => t.id == ticketId);
        AppState.accountTicketEvents.splice(index, 1);
    }


}
export const ticketService = new TicketsService();
