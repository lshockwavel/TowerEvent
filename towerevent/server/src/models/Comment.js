import { Schema } from "mongoose";


export const CommentSchema = new Schema({
    eventId: { type: Schema.Types.ObjectId, ref: 'TowerEvent', required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    body: { type: String, required: true, maxLength: 500 }
}, { timestamps: true, toJSON: { virtuals: true } })

CommentSchema.virtual('creator', {
    localField: 'creatorId',
    ref: 'Account',
    foreignField: '_id',
    justOne: true
})