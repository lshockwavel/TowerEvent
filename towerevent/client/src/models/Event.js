


export class Event {
    constructor(data) {
        this.id = data.id;
        this.creatorId = data.creatorId;
        this.name = data.name;
        this.startDate = new Date(data.startDate);
        this.isCanceled = data.isCanceled;
        this.type = data.type;
        this.capacity = data.capacity;
        this.location = data.location;
        this.description = data.description;
        this.category = data.category;
        this.coverImg = data.coverImg;
        this.creator = data.creator;
        this.ticketCount = data.ticketCount || 0;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
    }

    get typeColor() {
        switch (this.type) {
            case 'concert':
                return 'primary';
            case 'convention':
                return 'success';
            case 'sport':
                return 'info';
            case 'digital':
                return 'warning';
            default:
                return 'secondary';
        }
    }
}