<script setup>
import { computed } from "vue";

const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },

    totalPages: {
        type: Number,
        required: true
    }
});

const emit = defineEmits([
    "update:currentPage"
]);


const visiblePages = computed(() => {

    if (props.totalPages <= 7) {
        return Array.from(
            { length: props.totalPages },
            (_, index) => index + 1
        );
    }

    // Near the beginning
    if (props.currentPage <= 4) {
        return [
            1,
            2,
            3,
            4,
            5,
            "...",
            props.totalPages
        ];
    }

    // Near the end
    if (props.currentPage >= props.totalPages - 3) {
        return [
            1,
            "...",
            props.totalPages - 4,
            props.totalPages - 3,
            props.totalPages - 2,
            props.totalPages - 1,
            props.totalPages
        ];
    }

    // Somewhere in the middle
    return [
        1,
        "...",
        props.currentPage - 1,
        props.currentPage,
        props.currentPage + 1,
        "...",
        props.totalPages
    ];
});


function goToPage(page) {

    if (page === "...") {
        return;
    }

    if (page < 1 || page > props.totalPages) {
        return;
    }

    emit("update:currentPage", page);
}
</script>


<template>

    <nav
        class="boat-pagination"
        aria-label="Boat results navigation"
    >

        <!-- Previous -->
        <button
            type="button"
            class="boat-page-button boat-page-nav"
            :disabled="currentPage === 1"
            aria-label="Previous page"
            @click="goToPage(currentPage - 1)"
        >
            <i
                class="fa-solid fa-angle-left"
                aria-hidden="true"
            ></i>
        </button>


        <!-- Page numbers -->
        <template
            v-for="(page, index) in visiblePages"
            :key="index"
        >

            <span
                v-if="page === '...'"
                class="boat-page-ellipsis"
                aria-hidden="true"
            >
                ...
            </span>

            <button
                v-else
                type="button"
                class="boat-page-button"
                :class="{
                    'boat-page-current': page === currentPage
                }"
                :aria-current="page === currentPage ? 'page' : null"
                @click="goToPage(page)"
            >
                {{ page }}
            </button>

        </template>


        <!-- Next -->
        <button
            type="button"
            class="boat-page-button boat-page-nav"
            :disabled="currentPage === totalPages"
            aria-label="Next page"
            @click="goToPage(currentPage + 1)"
        >
            <i
                class="fa-solid fa-angle-right"
                aria-hidden="true"
            ></i>
        </button>

    </nav>

</template>


<style scoped>

.boat-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
}

.boat-page-button,
.boat-page-ellipsis {
    width: 36px;
    height: 36px;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    border: 1px solid #ccc;
    background-color: white;
}

.boat-page-button {
    cursor: pointer;
}

.boat-page-button:disabled {
    cursor: default;
    opacity: 0.5;
}

.boat-page-current {
    font-weight: bold;
}

.boat-page-ellipsis {
    cursor: default;
}

</style>