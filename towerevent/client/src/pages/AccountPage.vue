<script setup>
import { computed, onMounted } from 'vue';
import { AppState } from '../AppState.js';
import { eventsService } from '@/services/EventsService.js';
import { Pop } from '@/utils/Pop.js';
import { logger } from '@/utils/Logger.js';
import { ticketService } from '@/services/TicketsService.js';
import EventCard from '@/components/EventCard.vue';
import { TicketEvent } from '@/models/Ticket.js';
import TicketCard from '@/components/TicketCard.vue';

const account = computed(() => AppState.account)
// const events = computed(() => AppState.events)
const tickets = computed(() => AppState.accountTicketEvents)


onMounted(() => {
  getAllEvents();
  getAccountTickets();
})

const events = computed(() => {
  return AppState.events.filter(event => event.creator.id == AppState.account.id)
})

async function getAllEvents() {
  try {
    const events = await eventsService.getAllEvents();
    console.log('Events fetched successfully:', events);
  } catch (error) {
    Pop.toast('Failed to fetch events', 'error');
    logger.error(error);
    console.error('Failed to fetch events:', error);
  }
}

async function getAccountTickets() {
  try {
    await ticketService.getAccountTickets();
    console.log('Tickets fetched successfully:', tickets);
  } catch (error) {
    Pop.toast('Failed to fetch tickets', 'error');
    logger.error(error);
    console.error('Failed to fetch tickets:', error);
  }
}

</script>

<template>
  <div class="about text-center">
    <div v-if="account" class="container">
      <section class="row mb-3">
        <div class="col-12">
          <h2>Account Info</h2>
          <div class="d-flex">
            <img class="rounded" :src="account.picture" alt="" />
            <div>
              <div class="p-2">Name: {{ account.name }}</div>
              <span>
                {{ events?.length }} events
                <i class="mdi mdi-circle-small"></i>
                {{ tickets?.length }} tickets
              </span>
            </div>
          </div>
        </div>
      </section>
      <section class="row">
        <div class="col-12">
          <h2>Your Events</h2>
        </div>
        <div v-if="events.length === 0">
          <h3>You have not created any events yet.</h3>
          <p>
            <RouterLink to="/">Go create some events!</RouterLink>
          </p>
        </div>
        <div v-for="event in events" :key="event.id" class="col-12 col-md-4 p-2">
          <EventCard :event="event" />
        </div>
        <!-- <div v-else>
          <h3>You have not created any events yet.</h3>
          <p>
            <RouterLink to="/">Go create some events!</RouterLink>
          </p>
        </div> -->

      </section>
      <section class="row">
        <div class="col-12">
          <h2>Upcoming Events Attending</h2>
        </div>
        <div v-if="tickets.length === 0">
          <h3>You are not attending any upcoming events.</h3>
          <p>
            <RouterLink to="/">Go find some events to get tickets for!</RouterLink>
          </p>
        </div>
        <div v-for="ticket in tickets" :key="ticket.id" class="col-12 col-md-6 p-2">
          <TicketCard :ticket="ticket" />
        </div>
      </section>
      <!-- <section class="row">
        <div class="col-12">
          <h2>Upcoming Events Attending</h2>
          <div v-if="tickets.length" class="d-flex flex-wrap justify-content-center">
            <EventCard v-for="ticket in tickets" :key="ticket.id" :event="ticket.event" class="m-2" />
          </div>
          <div v-else>
            <h3>You are not attending any upcoming events.</h3>
            <p>
              <RouterLink to="/">Go find some events!</RouterLink>
            </p>
          </div>
        </div>
      </section> -->
    </div>
    <div v-else>
      <h1>Loading... <i class="mdi mdi-loading mdi-spin"></i></h1>
    </div>
  </div>
</template>

<style scoped lang="scss">
img {
  max-width: 100px;
}
</style>
