import { Schema } from "mongoose";


export const TowerEventSchema = new Schema({
    name: { type: String, minLength: 3, maxLength: 100, required: true },
    description: { type: String, minLength: 15, maxLength: 1000, required: true },
    coverImg: { type: String, required: true, maxLength: 250 },
    location: { type: String, minLength: 1, maxLength: 500, required: true},
    capacity: { type: Number, min: 1, max: 5000, required: true},
    startDate: { type: Date, required: true},
    isCanceled: { type: Boolean, default: false },
    type: { type: String, enum: ['concert', 'convention', 'sport', 'digital'], default: 'concert' },

    creatorId: {type: Schema.ObjectId, ref: 'Account', required: true}
}, { timestamps: true, toJSON: { virtuals: true } })

TowerEventSchema.virtual('creator', {
    localField: 'creatorId',
    ref: 'Account',
    foreignField: '_id',
    justOne: true
})

TowerEventSchema.virtual('ticketCount', {
    ref: 'Ticket',
    localField: '_id',
    foreignField: 'eventId',
    count: true
})