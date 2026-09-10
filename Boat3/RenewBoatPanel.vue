<script setup>

const emit = defineEmits([
    "renew"
]);

function renewBoat() {
    emit("renew");
}

</script>


<template>

    <details class="boat-renew-details">

        <summary class="boat-renew-summary">

            <span class="boat-renew-title">
                Don't see your boat listed?
            </span>

        </summary>


        <div class="boat-renew-content">

            <div class="boat-renew-icon">
                <i
                    class="fa-solid fa-ship"
                    aria-hidden="true"
                ></i>
            </div>


            <h3 class="boat-renew-heading">
                Don't see your boat listed?
            </h3>


            <p>
                The LDWF Customer Portal allows you to find and pay
                for renewals on Boat registrations, even if the boat
                is not associated with your account.
            </p>


            <p class="boat-renew-instructions">
                Select Renew Boat Registration to search and renew a boat.
            </p>


            <button
                type="button"
                class="boat-renew-button"
                @click="renewBoat"
            >
                <i
                    class="fa-solid fa-rotate"
                    aria-hidden="true"
                ></i>

                Renew Boat Registration
            </button>

        </div>

    </details>

</template>


<style scoped>

.boat-renew-details {
    border: 2px dashed #718447;
    border-radius: 4px;

    margin-top: 12px;
}


/*
    Remove the browser's native details marker.
*/
.boat-renew-summary {
    list-style: none;
    cursor: pointer;
}

.boat-renew-summary::marker {
    content: "";
}

.boat-renew-summary::-webkit-details-marker {
    display: none;
}


/* -------------------------------------------------- */
/* CLOSED                                             */
/* -------------------------------------------------- */

.boat-renew-summary {
    min-height: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-weight: bold;
}


/*
    Our replacement triangle.
*/
.boat-renew-summary::before {
    content: "▶";

    display: inline-block;

    margin-right: 8px;

    font-size: 0.75rem;

    transition: transform 0.15s ease;
}


/*
    Hide the expanded content while details is closed.

    The browser already does this automatically, but
    leaving all expanded layout in .boat-renew-content
    keeps the component easier to understand.
*/
.boat-renew-content {
    padding: 14px;
}


/* -------------------------------------------------- */
/* OPEN                                               */
/* -------------------------------------------------- */

.boat-renew-details[open] {
    padding: 10px;
}


/*
    Rotate ▶ into ▼.
*/
.boat-renew-details[open] .boat-renew-summary::before {
    transform: rotate(90deg);
}


/*
    When expanded, align the summary/title to the left.
*/
.boat-renew-details[open] .boat-renew-summary {
    justify-content: flex-start;
}


/* -------------------------------------------------- */
/* EXPANDED CONTENT                                   */
/* -------------------------------------------------- */

.boat-renew-icon {
    width: 70px;
    height: 70px;

    margin: 0 auto 12px auto;

    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: white;

    font-size: 2rem;
}


.boat-renew-heading {
    margin-bottom: 8px;
}


.boat-renew-instructions {
    font-weight: bold;
}


.boat-renew-button {
    width: 100%;
}

</style>