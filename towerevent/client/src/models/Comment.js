

export class Comment {
    constructor(data) {
        this.id = data.id;
        this.creatorId = data.creatorId;
        this.eventId = data.eventId;
        this.body = data.body;
        this.creator = data.creator;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
    }
}