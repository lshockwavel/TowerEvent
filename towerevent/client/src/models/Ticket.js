import { Event } from "./Event.js";


export class Ticket {
    constructor(data) {
        this.id = data.id;
        this.accountId = data.accountId;
        this.eventId = data.eventId;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
    }
}


export class TicketProfile extends Ticket {
    constructor(data) {
        super(data);
        this.profileName = data.profile.name;
        this.profilePicture = data.profile.picture;
        this.profileId = data.profile.id;
    }
}

export class TicketEvent extends Ticket {
    constructor(data) {
        super(data);
        this.event = new Event(data.event);
    }
}