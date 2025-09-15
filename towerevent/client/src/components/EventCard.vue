<script setup>
import { Event } from '@/models/Event.js';



const props = defineProps({ event: Event })

</script>


<template>
    <RouterLink :to="{ name: 'Event Details', params: { eventId: event.id } }" class="text-decoration-none text-dark">
        <div class="card mb-3">
            <!-- <img :src="event.coverImg" class="card-img-top" alt="Event Cover Image"> -->
            <div class="img-container position-relative">
                <div class="img-container position-relative">
                    <img :src="event.coverImg" class="card-img-top" alt="Event Cover Image">
                    <i class="event-type-icon mdi" :class="{
                        'mdi-party-popper': event.type === 'concert',
                        'mdi-account-group': event.type === 'convention',
                        'mdi-soccer': event.type === 'sport',
                        'mdi-television': event.type === 'digital'
                        // add more types as needed
                    }"></i>
                    <span v-if="event.ticketCount >= event.capacity" class="sold-out-pill">Sold Out</span>
                    <span v-else-if="event.isCanceled" class="cancelled-pill">Cancelled</span>
                </div>
            </div>
            <div class="card-body">
                <h5 class="card-title">{{ event.name }}</h5>
                <p class="card-text">{{ event.id }}</p>
                <p>{{ event.startDate.toLocaleDateString() }} - {{ event.location }}</p>
                <p class="card-text"><small class="text-muted">Hosted by {{ event.creator.name }}</small></p>
                <p class="card-text"><small class="text-muted">{{ event.ticketCount }} attending</small></p>
            </div>
        </div>
    </RouterLink>
</template>


<style lang="scss" scoped>

.img-container {
  position: relative;
}
.event-type-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 2rem;
  color: #fff;
  text-shadow: 0 0 4px #000;
}

.sold-out-pill {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: #dc3545;
  color: #fff;
  padding: 4px 16px;
  border-radius: 999px;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 2;
}

.cancelled-pill {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: #dc3545;
  color: #fff;
  padding: 4px 16px;
  border-radius: 999px;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 2;
}

</style>