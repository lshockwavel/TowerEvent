import { logger } from "@/utils/Logger.js";
import { api } from "./AxiosService.js";
import { AppState } from "@/AppState.js";
import { Comment } from "@/models/Comment.js";



class CommentsService {
  
    async createComment(commentData) {
        const response = await api.post('api/comments', commentData);
        logger.log('created comment', response.data);

        const comment = new Comment(response.data);
        AppState.comments.unshift(comment);
    }

    async getCommentsByEventId(eventId) {
        const response = await api.get(`api/events/${eventId}/comments`);
        logger.log('event comments', response.data);
        
        AppState.comments = response.data.map(comment => new Comment(comment));
    }

    async deleteComment(commentId) {
        const response = await api.delete(`api/comments/${commentId}`);
        console.log('Deleted Comment', response.data);

        //Remove from AppState too
        const index = AppState.comments.findIndex(comment => comment.id == commentId);
        AppState.comments.splice(index, 1);
    }
}
export const commentsService = new CommentsService();