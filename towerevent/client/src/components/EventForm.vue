<script setup>
import { eventsService } from '@/services/EventsService.js';
import { Pop } from '@/utils/Pop.js';
import { Modal } from 'bootstrap';
import { ref } from 'vue';
import { useRouter } from 'vue-router';



const router = useRouter();

const eventData = ref({
    name: '',
    description: '',
    coverImg: '',
    location: '',
    capacity: 0,
    startDate: '',
    type: ''
});


async function createEvent() {
    try {
        // Assuming you have an eventsService to handle API calls
        const eventResponse = await eventsService.createEvent(eventData.value);
        console.log('Event created successfully', eventResponse);
        resetForm();
        Pop.toast('Event created successfully', 'success');
        Modal.getOrCreateInstance('#event-form').hide();
        router.push({ name: 'Event Details', params: { eventId: eventResponse.id } });

        // Optionally, redirect or reset form
    } catch (error) {
        console.error('Failed to create event:', error);
    }
}

function resetForm() {
    eventData.value = {
        name: '',
        description: '',
        coverImg: '',
        location: '',
        capacity: 0,
        startDate: '',
        type: ''
    };
}

</script>


<template>
    <form @submit.prevent="createEvent()" class="row">
        <div class="mb-3 col-12">
            <label for="name" class="form-label">Event Name</label>
            <input v-model="eventData.name" type="text" class="form-control" id="name" required>
        </div>
        <div class="mb-3 col-12">
            <label for="description" class="form-label">Description</label>
            <textarea v-model="eventData.description" class="form-control" id="description" rows="3" required></textarea>
        </div>
        <div class="mb-3 col-12">
            <label for="coverImg" class="form-label">Cover Image URL</label>
            <input v-model="eventData.coverImg" type="url" class="form-control" id="coverImg">
        </div>
        <div class="mb-3 col-md-6">
            <label for="location" class="form-label">Location</label>
            <input v-model="eventData.location" type="text" class="form-control" id="location" required>
        </div>
        <div class="mb-3 col-md-6">
            <label for="capacity" class="form-label">Capacity</label>
            <input v-model.number="eventData.capacity" type="number" class="form-control" id="capacity" min="1">
        </div>
        <div class="mb-3 col-md-6">
            <label for="startDate" class="form-label">Start Date & Time</label>
            <input v-model="eventData.startDate" type="datetime-local" class="form-control" id="startDate" required>
        </div>
        <div class="mb-3 col-md-6">
            <label for="type" class="form-label">Event Type</label>
            <select v-model="eventData.type" class="form-select" id="type" required>
                <option value="" disabled>Select type</option>
                <option value="concert">Concert</option>
                <option value="convention">Convention</option>
                <option value="sport">Sport</option>
                <option value="digital">Digital</option>
            </select>
        </div>
        <div class="text-end">
            <button class="btn btn-primary">Create Event <i class="mdi mdi-plus"></i></button>
        </div>
    </form>
</template>


<style lang="scss" scoped>

</style>