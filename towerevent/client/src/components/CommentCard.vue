<script setup>
import { AppState } from '@/AppState.js';
import { Comment } from '@/models/Comment.js';
import { commentsService } from '@/services/CommentsService.js';
import { ticketService } from '@/services/TicketsService.js';
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

    await commentsService.deleteComment(props.comment.id);
    console.log(`Delete comment with ID: ${props.comment.id}`);
}

async function getEventTickets() {
    const eventId = Array.isArray(route.params.eventId) ? route.params.eventId[0] : route.params.eventId;  // Ensure eventId is a string??
    try {
        await ticketService.getTicketsByEventId(eventId);
        console.log('Event tickets fetched:', AppState.eventTicketProfiles);
    } catch (error) {
        console.error('Failed to fetch event tickets:', error);
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
                <h5 class="card-title">{{ comment.creator.name }}</h5>
                <p class="card-text">{{ comment.body }}</p>
                <small class="text-muted">Posted on: {{ comment.createdAt }}</small>
            </div>
            <div v-if="account?.id == comment.creatorId" class="card-footer">
                <button @click="deleteComment" class="btn btn-danger">Delete Comment</button>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>

</style>