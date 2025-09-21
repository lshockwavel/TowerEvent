import { AppState } from "@/AppState.js";
import { api } from "./AxiosService.js";
import { logger } from "@/utils/Logger.js";
import { Event } from "@/models/Event.js";



class EventsService {

    async getEventById(eventId) {
        AppState.activeEvent = null;
        const response = await api.get(`api/events/${eventId}`);
        logger.log('event by id', response.data);
        AppState.activeEvent = new Event(response.data);
    }

    async createEvent(eventData) {
        const response = await api.post('api/events', eventData);
        logger.log('created event', response.data);
        const createdEvent = new Event(response.data);
        AppState.events.unshift(createdEvent);
        return createdEvent;
    }

    async editEvent(eventData) {
        const eventId = eventData.id;
        const response = await api.put(`api/events/${eventId}`, eventData);
        logger.log('edited event', response.data);

        const editedEvent = new Event(response.data);
        const index = AppState.events.findIndex(e => e.id == eventId);
        AppState.events.splice(index, 1, editedEvent);
    }

    async getAllEvents() {
        const response = await api.get('api/events');
        logger.log('all events', response.data);
        AppState.events = response.data.map(e => new Event(e));
    }

    // Archive the Event actually
    async cancelEvent(eventId) {
        const response = await api.delete(`api/events/${eventId}`);
        if(!response.data){
            throw new Error('Unable to cancel event', response.data);
        }
        logger.log('canceled event', response.data);
        // TODO flip bool -Done
        // AppState.activeEvent.isCanceled = true;
        AppState.activeEvent.isCanceled = !response.data.isCanceled;

        // AppState.activeEvent = null;
        // this.getEventById(eventId);

        // // This should toggle the isCanceled property right?
        // const event = AppState.activeEvent;

        // if (!event) {
        //     throw new Error('Event not found');
        // }
        // if (event.isCanceled) {
        //     throw new Error('Event is already canceled');
        // }
        // event.isCanceled = !event.isCanceled;
        // await event.save();

        // To actually delete it, uncomment the lines below (but why would you want to do that?)
        // const index = AppState.events.findIndex(e => e.id == eventId);
        // AppState.events.splice(index, 1);
    }
}
export const eventsService = new EventsService();