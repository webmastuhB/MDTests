<script setup>
import { ref, computed } from "vue";

import BoatCard from "./BoatCard.vue";
import BoatPagination from "./BoatPagination.vue";
import RenewBoatPanel from "./RenewBoatPanel.vue";

const searchText = ref("");
const currentPage = ref(1);
const pageSize = 3;

const boats = ref([
    // temporary fake data
]);

const sortedBoats = computed(() =>
    [...boats.value].sort(
        (a, b) => new Date(a.expDate) - new Date(b.expDate)
    )
);

const pagedBoats = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return sortedBoats.value.slice(start, start + pageSize);
});
</script>

<template>
    <section class="my-boats">

        <h2>My Boats</h2>

        <label for="boatSearch">
            Search My Boats
        </label>

        <input
            id="boatSearch"
            v-model="searchText"
            type="text"
        />

        <div class="boat-list">

            <BoatCard
                v-for="boat in pagedBoats"
                :key="boat.boatId"
                :boat="boat"
            />

        </div>

        <BoatPagination
            v-model:current-page="currentPage"
        />

        <RenewBoatPanel />

    </section>
</template>