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
        Pop.toast('Failed to load event details', 'error');
    }
}

async function getEventTickets() {
    const eventId = Array.isArray(route.params.eventId) ? route.params.eventId[0] : route.params.eventId;  // Ensure eventId is a string??
    try {
        await ticketService.getTicketsByEventId(eventId);
        console.log('Event tickets fetched:', AppState.eventTicketProfiles);
    } catch (error) {
        console.error('Failed to fetch event tickets:', error);
        Pop.toast('Failed to load event tickets', 'error');
    }
}

async function getEventComments() {
    const eventId = route.params.eventId;
    try {
        await commentsService.getCommentsByEventId(eventId);
        console.log('Event comments fetched:', AppState.comments);
    } catch (error) {
        console.error('Failed to fetch event comments:', error);
        Pop.toast('Failed to load event comments', 'error');
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
        Pop.toast('Failed to add comment', 'error');
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
        Pop.toast('Failed to create ticket', 'error');
    }
}

async function cancelEvent() {
    if(AppState.account?.id !== event.value?.creatorId) {
        Pop.toast('You are not authorized to cancel this event', 'error');
        return;
    }

    //Setting different confirmation messages for cancel vs uncanceled
    let message = '';
    if(event.value?.isCanceled) {
        message = "Are you sure you want to un-cancel this event?";
    }
    else {
        message = "Are you sure you want to cancel this event?";
    }
    const confirm = window.confirm(message);
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
                <i v-if="event?.isCanceled" class="mdi mdi-cancel cancelled-icon" title="Cancelled">Cancelled</i>
            </div>
        </section>
        <section class="row my-4">
            <div class="col-md-8">
                <div v-if="event" class="card mb-3">
                    <div class="card-body">
                        <div class="d-flex ">
                            <div class="me-auto d-flex align-items-center gap-2">
                                <h2 class="card-title">{{ event.name }}</h2>
                                <span class="badge bg-success me-2">{{ event.type }}</span>
                            </div>
                            <div v-if="event?.creatorId == AppState.account?.id" class="ms-auto">
                                <div class="dropdown">
                                    <button class="btn btn-link p-0" type="button" data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        <i class="mdi mdi-dots-horizontal fs-1"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <!-- <li><a class="dropdown-item" href="#">Edit (WIP?)</a></li> -->
                                        <li v-if="!event?.isCanceled" @click="cancelEvent" class="dropdown-item">Cancel Event</li>
                                        <li v-else @click="cancelEvent" class="dropdown-item">Uncancel Event</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center mb-3">
                            <img :src="event?.creator.picture" alt="Creator Picture" class="rounded-circle me-2"
                                width="50" height="50">
                            <h5 class="card-title"><span class="text-muted">Hosted by:</span> {{ event?.creator.name }}</h5>
                        </div>
                        <p class="card-text mb-4">{{ event.description }}</p>
                        <h5>Date and Time</h5>
                        <p class="card-text mb-4"> <i class="mdi mdi-calendar"></i><small class="text-muted">Starts: {{ event.formattedStartDate }}</small></p>
                        <h5>Location</h5>
                        <p class="card-text mb-4"> <i class="mdi mdi-map-marker"></i><small class="text-muted">At: {{ event.location }}</small></p>
                    </div>
                </div>
                <div v-else>
                    <p>Loading event details...</p>
                </div>
                <div class="mt-4">
                    <h3>Comments</h3>
                    <form @submit.prevent="addComment()" v-if="AppState.account" class="mb-4">
                        <div class="mb-3">
                            <label for="comment-body" class="form-label">Comment</label>
                            <textarea id="comment-body" class="form-control" type="text" required
                                v-model="CommentData.body"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Add Comment</button>
                    </form>
                    <div v-else class="text-danger">
                        <p>Please log in to add a comment.</p>
                    </div>
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
                        <!-- TODO also don't show if the event is cancelled - Done -->
                        <button v-if="event?.capacity - event?.ticketCount > 0 && !event?.isCanceled && AppState.account" class="btn btn-primary"
                            @click="createTicket">Get Ticket</button>
                        <button v-else-if="event?.isCanceled" class="btn btn-secondary" disabled>Event Cancelled</button>
                        <button v-else-if="!AppState.account" class="btn btn-danger" disabled>Please log in</button>
                        <button v-else class="btn btn-secondary" disabled>Sold Out</button>
                        <!-- List of ticket holders -->
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Attendees:</h4>
                        <ul class="card-text list-group list-group-flush">
                            <li v-for="ticket in ticketProfile" :key="ticket.id" class="list-group-item">
                                <div class="d-flex border-start border-4 border-purple p-2 align-items-center">
                                    <img :src="ticket?.profilePicture" alt="Profile Picture"
                                        class="rounded-circle me-2" width="40" height="40">
                                    <p class="mb-0">{{ ticket?.profileName }}</p>
                                </div>
                            </li>
                        </ul>
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
  padding: 15px;
}
</style>