export default {
    name: "BoatCard",

    props: {
        boat: {
            type: Object,
            required: true
        }
    },

    computed: {
        expirationDate() {
            return new Date(this.boat.expDate);
        },

        isExpired() {
            return this.expirationDate < new Date();
        },

        expiresSoon() {
            if (this.isExpired) {
                return false;
            }

            const today = new Date();

            const sixtyDays =
                60 * 24 * 60 * 60 * 1000;

            return (
                this.expirationDate - today <=
                sixtyDays
            );
        },

        showRenewButton() {
            return this.isExpired || this.expiresSoon;
        },

        formattedExpirationDate() {
            return this.expirationDate.toLocaleDateString();
        },

        formattedLength() {
            const feet =
                Math.floor(this.boat.length / 12);

            const inches =
                this.boat.length % 12;

            return \`\${feet}' \${inches}"\`;
        }
    },

    methods: {
        renewBoat() {
            console.log(
                "Renew boat:",
                this.boat
            );
        },

        viewBoat() {
            console.log(
                "View boat:",
                this.boat
            );
        }
    },

    template: `
        <article class="boat-card">

            <div class="boat-card-header">

                <strong class="boat-license-number">
                    ⚓ {{ boat.licenseNumber }}
                </strong>

                <span
                    v-if="isExpired"
                    class="boat-status boat-status-expired"
                >
                    ⓘ Expired
                </span>

                <span
                    v-else-if="expiresSoon"
                    class="boat-status boat-status-soon"
                >
                    ⓘ Expires Soon
                </span>

            </div>


            <div class="boat-card-body">

                <div class="boat-property">
                    <strong>Make/Mfr:</strong>

                    <span>
                        {{ boat.make }} /
                        {{ boat.manufacturer }}
                    </span>
                </div>

                <div class="boat-property">
                    <strong>Model Year:</strong>
                    <span>{{ boat.modelYear }}</span>
                </div>

                <div class="boat-property">
                    <strong>Length:</strong>
                    <span>{{ formattedLength }}</span>
                </div>

                <div class="boat-property">
                    <strong>Exp. Date:</strong>
                    <span>{{ formattedExpirationDate }}</span>
                </div>

            </div>


            <div class="boat-card-buttons">

                <button
                    v-if="showRenewButton"
                    type="button"
                    class="boat-renew-button"
                    @click="renewBoat"
                >
                    ↻ Renew Registration
                </button>

                <button
                    type="button"
                    class="boat-details-button"
                    @click="viewBoat"
                >
                    View Boat Details
                </button>

            </div>

        </article>
    `
};