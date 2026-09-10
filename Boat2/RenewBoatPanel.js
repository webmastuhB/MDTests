export default {
    name: "RenewBoatPanel",

    methods: {
        renewBoat() {
            console.log(
                "Renew unlisted boat"
            );
        }
    },

    template: `
        <details class="boat-renew-details">

            <summary class="boat-renew-summary">

                <span class="boat-renew-title">
                    Don't see your boat listed?
                </span>

            </summary>


            <div class="boat-renew-content">

                <div class="boat-renew-icon">
                    ⚓
                </div>

                <h3>
                    Don't see your boat listed?
                </h3>

                <p>
                    The LDWF Customer Portal allows you to
                    find and pay for renewals on Boat
                    registrations, even if the boat is not
                    associated with your account.
                </p>

                <p>
                    <strong>
                        Select Renew Boat Registration to
                        search and renew a boat.
                    </strong>
                </p>

                <button
                    type="button"
                    class="boat-renew-registration-button"
                    @click="renewBoat"
                >
                    ↻ Renew Boat Registration
                </button>

            </div>

        </details>
    `
};