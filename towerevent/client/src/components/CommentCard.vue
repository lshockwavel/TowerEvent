<script setup>
import { AppState } from '@/AppState.js';
import { Comment } from '@/models/Comment.js';
import { commentsService } from '@/services/CommentsService.js';
import { ticketService } from '@/services/TicketsService.js';
import { Pop } from '@/utils/Pop.js';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const props = defineProps({ comment: Comment })

const account = computed(() => AppState.account)
const activeEvent = computed(() => AppState.activeEvent)

const isAttending = computed(() => {
  return AppState.accountTicketEvents.filter(ticket => ticket.event.creator.id === account.value.id).length > 0;
});

onMounted(() => {
    getEventTickets();
})

async function deleteComment() {
    // Implement comment deletion logic here
    // TODO confirm delete - Done
    // TODO don't forget your try/catch - Done
    const confirmed = await Pop.confirm('Are you sure you want to delete this comment?');
    if (confirmed) {
        try {
            const commentId = props.comment.id;
            await commentsService.deleteComment(commentId);
            Pop.toast('Comment deleted successfully', 'success');
            // Optionally, you might want to remove the comment from the UI or refresh the comments list
        } catch (error) {
            console.error('Failed to delete comment:', error);
            Pop.toast('Failed to delete comment', 'error');
        }
    }

    // await commentsService.deleteComment(props.comment.id);
    // console.log(`Delete comment with ID: ${props.comment.id}`);
}

async function getEventTickets() {
    const eventId = Array.isArray(route.params.eventId) ? route.params.eventId[0] : route.params.eventId;  // Ensure eventId is a string??
    try {
        await ticketService.getTicketsByEventId(eventId);
        console.log('Event tickets fetched:', AppState.eventTicketProfiles);
    } catch (error) {
        console.error('Failed to fetch event tickets:', error);
        Pop.toast('Failed to fetch event tickets', 'error');
        // TODO Pop a notification -Done
    }
}


</script>

<template>
    <div v-if="comment" class="mb-3">
        <div class="card comment-card d-flex flex-column">
                <div v-if="activeEvent?.creatorId == comment.creatorId" class="card-header">
                    <span class="badge bg-primary">Event Creator</span>
                </div>
                <div v-else-if="isAttending" class="card-header">
                    <span class="badge bg-success">Attending</span>
                </div>
            <div class="card-body">
                <div class="d-flex align-items-center mb-2">
                    <img class="rounded-circle me-2" :src="comment.creator.picture" alt="Creator's profile picture" width="40" height="40" />
                    <h5 class="card-title">{{ comment.creator.name }}</h5>
                </div>
                <p class="card-text">{{ comment.body }}</p>
                <small class="text-muted">Posted on: {{ comment.createdAt.toLocaleString() }}</small>
            </div>
            <div v-if="account?.id == comment.creatorId" class="card-footer">
                <button @click="deleteComment" class="btn btn-danger">Delete Comment</button>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>

</style>