import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { commentsService } from "../services/CommentsService.js";


export class CommentController extends BaseController {
    constructor() {
        super('api/comments')
        this.router
            .use(Auth0Provider.getAuthorizedUserInfo)
            .post('', this.createComment)
            .delete('/:CommentId', this.deleteComment)
    }

    async createComment(req, res, next) {
        try {
            const commentData = req.body;
            commentData.creatorId = req.userInfo.id; //Setting up user with CreatorId
            const comment = await commentsService.createComment(commentData);
            res.send(comment);
        } catch (error) {
            next(error);
        }
    }

    async deleteComment(req, res, next) {
        try {
            const accountId = req.userInfo.id;
            const commentId = req.params.CommentId;
            await commentsService.deleteComment(commentId, accountId);
            res.send({ message: 'Comment deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

}