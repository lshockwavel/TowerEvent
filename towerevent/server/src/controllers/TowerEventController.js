import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { towerEventsService } from "../services/TowerEventsService.js";
import { ticketService } from "../services/TicketsService.js";
import { commentsService } from "../services/CommentsService.js";


export class TowerEventController extends BaseController {
    constructor() {
        super('api/events')
        this.router
        .get('', this.getAllEvents)
        .get('/:EventId', this.getEventById)
        .get('/:EventId/comments', this.getCommentsByEventId)
        .get('/:EventId/tickets', this.getTicketsByEventId)
        .use(Auth0Provider.getAuthorizedUserInfo)
        .post('', this.createEvent)
        .put('/:EventId', this.editEvent)
        .delete('/:EventId', this.deleteEvent)
    }

    async createEvent(req, res, next) {
        try {
            req.body.creatorId = req.userInfo.id
            const eventData = await towerEventsService.createTowerEvent(req.body)
            return res.send(eventData)
        } catch (error) {
            next(error)
        }
    }

    async getAllEvents(req, res, next) {
        try {
            const eventData = await towerEventsService.getAllEvents()
            return res.send(eventData)
        } catch (error) {
            next(error)
        }
    }

    async getTicketsByEventId(req, res, next) {
        try {
            const eventId = req.params.EventId
            const tickets = await ticketService.getTicketsByEventId(eventId)
            return res.send(tickets)
        } catch (error) {
            next(error)
        }
    }

    async getEventById(req, res, next) {
        try {
            const eventData = await towerEventsService.getTowerEventById(req.params.EventId)
            return res.send(eventData)
        } catch (error) {
            next(error)
        }
    }

    async getCommentsByEventId(req, res, next) {
        try {
            const eventId = req.params.EventId
            const comments = await commentsService.getCommentsByEventId(eventId)
            return res.send(comments)
        } catch (error) {
            next(error)
        }
    }

    async editEvent(req, res, next) {
        try {
            const eventId = req.params.EventId;
            const EventData = req.body;
            EventData.creatorId = req.userInfo.id
            const eventData = await towerEventsService.editTowerEvent(eventId, EventData)
            return res.send(eventData)
        } catch (error) {
            next(error)
        }
    }

    async deleteEvent(req, res, next) {
        try {
            const eventId = req.params.EventId;
            const userId = req.userInfo.id;
            await towerEventsService.deleteTowerEvent(eventId, userId)
            return res.send({ message: 'Event deleted successfully' })
        } catch (error) {
            next(error)
        }
    }
}