<script setup>
import { AppState } from '@/AppState.js';
import { commentsService } from '@/services/CommentsService.js';
import CommentCard from '@/components/CommentCard.vue';
import { eventsService } from '@/services/EventsService.js';
import { ticketService } from '@/services/TicketsService.js';
import { Pop } from '@/utils/Pop.js';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';



const route = useRoute();

const event = computed(() => AppState.activeEvent);
const ticketProfile = computed(() => AppState.eventTicketProfiles);
const comments = computed(() => AppState.comments);

const CommentData = ref({
    body: '',
    eventId: ''
});

const TicketData = ref({
    eventId: '',
    accountId: ''
});


onMounted(() => {
    getEventById();
    getEventTickets();
    getEventComments();
})

async function getEventById() {
    const eventId = route.params.eventId;
    try {
        await eventsService.getEventById(eventId);
        console.log('Active event set:', AppState.activeEvent);
    } catch (error) {
        console.error('Failed to set active event:', error);
    }
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

async function getEventComments() {
    const eventId = route.params.eventId;
    try {
        await commentsService.getCommentsByEventId(eventId);
        console.log('Event comments fetched:', AppState.comments);
    } catch (error) {
        console.error('Failed to fetch event comments:', error);
    }
}

async function addComment() {
    const eventId = route.params.eventId;
    try {
        CommentData.value.eventId = Array.isArray(eventId) ? eventId[0] : eventId; // Ensure eventId is a string??
        await commentsService.createComment(CommentData.value);
        console.log('Comment added successfully');
        resetForm();
        await getEventComments(); // Refresh the comment list after adding a new comment
    } catch (error) {
        console.error('Failed to add comment:', error);
    }
}

async function createTicket() {
    const eventId = route.params.eventId;
    try {
        TicketData.value.eventId = Array.isArray(eventId) ? eventId[0] : eventId; // Ensure eventId is a string??
        TicketData.value.accountId = AppState.account.id;
        await ticketService.createTicket(TicketData.value);
        console.log('Ticket created successfully');
        await getEventTickets(); // Refresh the ticket list after creating a new ticket

        //Add to the ticket counter for the Event
        if (event.value) {
            event.value.ticketCount += 1;
        }
    } catch (error) {
        console.error('Failed to create ticket:', error);
    }
}

async function cancelEvent() {

    const confirm = window.confirm('Are you sure you want to cancel this event? This action cannot be undone.');
    if (!confirm) {
        return;
    }

    const eventId = route.params.eventId;
    // const eventId = Array.isArray(route.params.eventId) ? route.params.eventId[0] : route.params.eventId;  // Ensure eventId is a string??
    try {
        await eventsService.cancelEvent(eventId);
        console.log('Event canceled successfully');
        Pop.toast('Event has been canceled', 'success');
        // Optionally, redirect to another page after cancellation
    } catch (error) {
        console.error('Failed to cancel event:', error);
        Pop.toast('Failed to cancel event', 'error');
    }
}

function resetForm() {
    CommentData.value = {
        body: '',
        eventId: ''
    };
}

</script>


<template>
    <div class="container">
        <section class="row my-4">
            <div class="img-container position-relative">
                <img :src="event?.coverImg" class="card-img-top" alt="Event Cover Image">
                <i v-if="event?.isCanceled" class="mdi mdi-cancel cancelled-icon" title="Cancelled"></i>
            </div>
        </section>
        <section class="row my-4">
            <div class="col-md-8">
                <div v-if="event" class="card mb-3">
                    <div class="card-body">
                        <div class="d-flex">
                            <div class="me-auto d-flex align-items-center gap-2">
                                <h2 class="card-title">{{ event.name }}</h2>
                                <span class="badge bg-success me-2">{{ event.type }}</span>
                            </div>
                            <div>
                                <div class="dropdown">
                                    <button class="btn btn-link p-0" type="button" data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        <i class="mdi mdi-dots-horizontal fs-1"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#">Edit (WIP?)</a></li>
                                        <li @click="cancelEvent" class="dropdown-item">Cancel Event</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex">
                            <img :src="event?.creator.picture" alt="Creator Picture" class="rounded-circle me-2"
                                width="50" height="50">
                            <h5 class="card-title">Hosted by {{ event?.creator.name }}</h5>
                        </div>
                        <p class="card-text">{{ event.description }}</p>
                        <p class="card-text"><small class="text-muted">Date: {{ event.startDate.toLocaleDateString()
                                }}</small></p>
                    </div>
                </div>
                <div v-else>
                    <p>Loading event details...</p>
                </div>
                <div class="mt-4">
                    <h3>Comments</h3>
                    <form @submit.prevent="addComment()">
                        <div class="mb-3">
                            <label for="comment-body" class="form-label">Comment</label>
                            <textarea id="comment-body" class="form-control" type="text" required
                                v-model="CommentData.body"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Add Comment</button>
                    </form>
                    <div v-if="comments.length">
                        <div v-for="comment in comments" :key="comment.id" class="mb-3">
                            <CommentCard :comment="comment" />
                        </div>
                    </div>
                    <div v-else>
                        <p>No comments yet. Be the first to comment!</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <!-- Setting up Ticket Attend -->
                <div class="card mb-3">
                    <div class="card-body">
                        <h3 class="card-title">Tickets</h3>
                        <p class="card-text">Total Tickets Sold: {{ event?.ticketCount || 0 }}</p>
                        <p class="card-text">Tickets left: {{ event?.capacity - event?.ticketCount || 0 }}</p>
                        <!-- TODO also don't show if the event is cancelled -->
                        <button v-if="event?.capacity - event?.ticketCount > 0" class="btn btn-primary"
                            @click="createTicket">Get Ticket</button>
                        <button v-else class="btn btn-secondary" disabled>Sold Out</button>
                        <!-- List of ticket holders -->
                        <div class="mt-4">
                            <h4>Attendees</h4>
                            <ul class="list-group">
                                <li v-for="ticket in ticketProfile" :key="ticket.id" class="list-group-item">
                                    <div class="d-flex">
                                        <img :src="ticket?.profilePicture" alt="Profile Picture"
                                            class="rounded-circle me-2" width="40" height="40">
                                        <p class="mb-0">{{ ticket?.profileName }}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>


<style lang="scss" scoped>
.dropdown-item:hover {
    cursor: pointer;
}

.img-container {
  position: relative;
}
.cancelled-icon {
  position: absolute;
  bottom: 16px;
  left: 16px;
  font-size: 2.5rem;
  color: red;
  background: rgba(255,255,255,0.7);
  border-radius: 50%;
  padding: 4px;
}
</style>