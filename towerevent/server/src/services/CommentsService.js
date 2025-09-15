import { dbContext } from "../db/DbContext.js";


class CommentsService {
    async createComment(commentData) {
        const comment = await dbContext.Comments.create(commentData);
        await comment.populate('creator', 'name picture');
        return comment;
    }

    async getCommentsByEventId(eventID) {
        const comments = await dbContext.Comments.find({ eventId: eventID }).populate('creator', 'name picture');
        return comments;
    }

    async deleteComment(commentId, accountId) {
        const comment = await dbContext.Comments.findById(commentId).populate('creator', 'name picture');
        if (!comment) {
            throw new Error('Comment not found');
        }

        // If the comment's creatorId does not match the accountId of the requester, throw an error
        if (comment.creatorId.toString() !== accountId) {
            throw new Error('You are not authorized to delete this comment');
        }
        
        await dbContext.Comments.findByIdAndDelete(commentId);
        return `Comment with id ${commentId} has been deleted.`;
    }
}

 export const commentsService = new CommentsService();