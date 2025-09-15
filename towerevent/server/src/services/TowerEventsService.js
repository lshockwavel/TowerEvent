import { dbContext } from "../db/DbContext.js"


class TowerEventsService {

    async createTowerEvent(eventData) {
        const towerEvent = await dbContext.TowerEvents.create(eventData);
        await towerEvent.populate('creator', 'name picture');
        await towerEvent.populate('ticketCount');
        return towerEvent;
    }

    async getAllEvents() {
        const towerEvents = await dbContext.TowerEvents.find().populate('creator', 'name picture').populate('ticketCount');
        return towerEvents;
    }

    async getTowerEventById(eventId) {
        const towerEvent = await dbContext.TowerEvents.findById(eventId).populate('creator', 'name picture').populate('ticketCount');
        if (!towerEvent) {
            throw new Error('Event not found');
        }
        return towerEvent;
    }

    async editTowerEvent(eventId, eventData) {
        const towerEvent = await dbContext.TowerEvents.findById(eventId);
        await towerEvent.populate('creator', 'name picture');
        await towerEvent.populate('ticketCount');

        // const towerEvent = await dbContext.TowerEvents.findByIdAndUpdate(eventId, eventData, { new: true, runValidators: true });
        if (!towerEvent) {
            throw new Error('Event not found or could not be updated');
        }

        if(towerEvent.isCanceled) {
            throw new Error('Cannot edit a canceled event');
        }


        if (towerEvent.creatorId != eventData.creatorId) {
            throw new Error('You do not have permission to edit this event');
        }

        //Making sure the fields are only updated if new data is provided
        towerEvent.name = eventData.name || towerEvent.name;
        towerEvent.description = eventData.description || towerEvent.description;
        towerEvent.coverImg = eventData.coverImg || towerEvent.coverImg;
        towerEvent.location = eventData.location || towerEvent.location;
        towerEvent.date = eventData.date || towerEvent.date;
        towerEvent.capacity = eventData.capacity || towerEvent.capacity;
        towerEvent.type = eventData.type || towerEvent.type;

        await towerEvent.save();
        return towerEvent;
    }

    //Archive function - soft delete
    async deleteTowerEvent(eventId, userId) {
        const towerEvent = await this.getTowerEventById(eventId);

        if (!towerEvent) {
            throw new Error('Event not found or could not be deleted');
        }

        if(towerEvent.creatorId != userId) {
            throw new Error('You do not have permission to delete this event');
        }

        towerEvent.isCanceled = !towerEvent.isCanceled; // Toggle the isCanceled status

        await towerEvent.save();
        return towerEvent;
    }


}

export const towerEventsService = new TowerEventsService();