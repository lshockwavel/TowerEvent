<script setup>
import { TicketEvent } from '@/models/Ticket.js';
import { ticketService } from '@/services/TicketsService.js';
import { logger } from '@/utils/Logger.js';
import { Pop } from '@/utils/Pop.js';



const props = defineProps({ ticket: TicketEvent})

async function deleteTicket() {
    const confirmDelete = await Pop.confirm('Are you sure you want to delete this ticket? This action cannot be undone.');
    if (!confirmDelete) {
        return;
    }

    const ticketId = props.ticket.id;
    try {
        await ticketService.deleteTicket(ticketId);
        Pop.toast('Ticket deleted successfully', 'success');
    } catch (error) {
        Pop.toast('Failed to delete ticket', 'error');
        logger.error(error);
    }
}

</script>


<template>
    <div class="card ticket-card d-flex flex-column">
        <img :src="ticket.event.coverImg" class="card-img-top" alt="Event Cover Image">
        <div class="card-body">
            <h5 class="card-title">{{ ticket.event.name }}</h5>
            <p class="card-text">Event Date: {{ new Date(ticket.event.startDate).toLocaleDateString() }}</p>
            <p class="card-text">Location: {{ ticket.event.location }}</p>
            <button @click="deleteTicket" class="btn btn-danger">Delete Ticket</button>
        </div>
    </div>
</template>


<style lang="scss" scoped>

</style>