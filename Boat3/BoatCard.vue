<script setup>
const props = defineProps({
    boat: {
        type: Object,
        required: true
    }
});

const expirationStatus = computed(() => {

    if (!props.boat?.expDate) {
        return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expDate = new Date(props.boat.expDate);

    if (Number.isNaN(expDate.getTime())) {
        return null;
    }

    expDate.setHours(0, 0, 0, 0);

    const sixtyDaysFromNow = new Date(today);
    sixtyDaysFromNow.setDate(
        sixtyDaysFromNow.getDate() + 60
    );


    if (expDate < today) {
        return {
            text: "Expired",
            className: "boat-status-expired"
        };
    }

    if (expDate <= sixtyDaysFromNow) {
        return {
            text: "Almost Expired",
            className: "boat-status-almost-expired"
        };
    }

    return null;
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