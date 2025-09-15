import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { ticketService } from "../services/TicketsService.js";



export class TicketController extends BaseController {
    constructor() {
        super('api/tickets')
        this.router
            .use(Auth0Provider.getAuthorizedUserInfo)
            .post('', this.createTicket)
            .delete('/:ticketId', this.deleteTicket)
    }

    async createTicket(req, res, next) {
        try {
            const ticketData = req.body
            ticketData.accountId = req.userInfo.id
            const ticket = await ticketService.createTicket(ticketData)
            return res.send(ticket)
        } catch (error) {
            next(error)
        }
    }

    async deleteTicket(req, res, next) {
        try {
            const accountId = req.userInfo.id;
            const ticketId = req.params.ticketId;
            const response = await ticketService.deleteTicket(ticketId, accountId)
            return res.send({ message: response })
        } catch (error) {
            next(error)
        }
    }
}