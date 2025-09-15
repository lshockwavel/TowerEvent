<script setup >
import { AppState } from '@/AppState.js';
import EventCard from '@/components/EventCard.vue';
import EventForm from '@/components/EventForm.vue';
import ModalWrapper from '../components/ModalWrapper.vue'; //REVIEW: Why can't I use the @ alias here?
import { eventsService } from '@/services/EventsService.js';
import { logger } from '@/utils/Logger.js';
import { Pop } from '@/utils/Pop.js';
import { computed, onMounted, ref } from 'vue';

const filterBy = ref('all')
const account = computed(() => AppState.account)

const events = computed(() => {
  if (filterBy.value == 'all') {
    return AppState.events
  }
  return AppState.events.filter(event => event.type == filterBy.value)
})

const filterButtons = [
  {text: 'all', icon: 'mdi mdi-view-dashboard'},
  {text: 'concert', icon: 'mdi mdi-music-note'},
  {text: 'convention', icon: 'mdi mdi-account-group'},
  {text: 'sport', icon: 'mdi mdi-soccer'},
  {text: 'digital', icon: 'mdi mdi-television'}
]

onMounted(() => {
  getAllEvents();
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

</script>

<template>
  <!-- <Example /> -->
  <div class="container-fluid">
    <!-- TODO Will use this to create form -->
    <ModalWrapper id="event-form">
      <EventForm />
     </ModalWrapper>
    <section class="row bg-Home-Page text-light p-3 position-relative">
      <div class="home-text col-md-5 position-absolute">
        <h1 class="fs-bold">Event management for people, by people</h1>
        <p class="lead">
          Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people
          who share it on Tower. Events are happening every day
          <span v-if="!account">-- Log in to join the fun.</span>
        </p>
      </div>
    </section>
  </div>
  <section class="position-relative">
    <!-- <img class="Home-Page" alt="logo" src="../assets/img/Event-Home-Page.jpg"  /> -->
  </section>
  <div class="container">
    <section class="row">
      <div class="col-12 text-center my-5">
        <h1 class="text-start">How Tower works</h1>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="d-flex">
            <div class="p-4">
              <i class="mdi mdi-magnify fs-1 text-success"></i>
            </div>
            <div class="p-4">
              <h3>Discover events you're interested in</h3>
              <p>Browse through community hosted events for all the things you love</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div data-bs-toggle="modal" data-bs-target="#event-form" class="card create-event-card" :class="{ disabled: !account }">
          <div class="d-flex">
            <div class="p-4">
              <i class="mdi mdi-plus fs-1 text-success"></i>
            </div>
            <div class="p-4">
              <h3>Start an event to invite your friends</h3>
              <p>Create your own Tower event, and draw from a community of millions</p>
              <div v-if="!account" class="text-danger">Log in to create an event</div>
              <div v-else class="text-success">Create an event!</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="row">
      <div class="col-12 text-center my-5">
        <h1 class="text-start">Explore top categories</h1>
      </div>
      <div v-for="filter in filterButtons" :key="filter.text" class="col-6 col-md-2 p-2">
        <div @click="filterBy = filter.text" class="btn w-100 p-4 btn-bg">
          <div class="text-capitalize">
            <i :class="filter.icon"></i> {{ filter.text }}
          </div>
        </div>
      </div>
    </section>
    <section class="row">
      <div class="col-12 text-center my-5">
        <h1 class="text-start">Upcoming Events</h1>
      </div>
      <div v-if="events.length == 0" class="text-center text-secondary my-5">
        <h3>No events to display</h3>
        <p>Try adjusting your filters or check back later</p>
      </div>
      <div v-for="event in events" :key="event.id" class="col-12 col-md-4 p-2">
        <EventCard :event="event" />
      </div>

    </section>
  </div>
</template>

<style scoped lang="scss">

.home-text {
  bottom: 80px;
  left: 65px;
  position: absolute;
  text-align: left;
}

.bg-Home-Page{
  background: url('../assets/img/Event-Home-Page.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  height: 60vh;
}

.create-event-card {
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
}

.create-event-card.disabled {
  pointer-events: none;
  cursor: not-allowed;
  transform: none; // disables hover effect
}



</style>
