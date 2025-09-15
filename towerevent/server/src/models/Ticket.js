import { Schema } from "mongoose";

export const TicketSchema = new Schema({
    eventId: { type: Schema.Types.ObjectId, ref: 'TowerEvent', required: true },
    accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true }
}, { timestamps: true, toJSON: { virtuals: true } })

TicketSchema.virtual('event', {
    localField: 'eventId',
    ref: 'TowerEvent',
    foreignField: '_id',
    justOne: true
})

TicketSchema.virtual('profile', {
    localField: 'accountId',
    ref: 'Account',
    foreignField: '_id',
    justOne: true
})