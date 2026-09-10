<script setup>
const props = defineProps({
    boat: {
        type: Object,
        required: true
    }
});
</script>

<template>
    <article class="boat-card">

        <strong>
            {{ boat.licenseNumber }}
        </strong>

        <div>
            <strong>Make/Mfr:</strong>
            {{ boat.make }} / {{ boat.manufacturer }}
        </div>

        <div>
            <strong>Model Year:</strong>
            {{ boat.modelYear }}
        </div>

        <div>
            <strong>Length:</strong>
            {{ boat.length }}
        </div>

    </article>
</template>