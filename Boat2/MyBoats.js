import BoatCard from "./BoatCard.js";
import BoatPagination from "./BoatPagination.js";
import RenewBoatPanel from "./RenewBoatPanel.js";

export default {
    name: "MyBoats",

    components: {
        BoatCard,
        BoatPagination,
        RenewBoatPanel
    },

    props: {
        boats: {
            type: Array,
            required: true
        }
    },

    data() {
        return {
            searchText: "",
            currentPage: 1,
            pageSize: 3
        };
    },

    computed: {
        sortedBoats() {
            return [...this.boats].sort(
                (a, b) => new Date(a.expDate) - new Date(b.expDate)
            );
        },

        filteredBoats() {
            const search = this.searchText
                .trim()
                .toLowerCase();

            if (!search) {
                return this.sortedBoats;
            }

            return this.sortedBoats.filter(boat => {
                return (
                    boat.licenseNumber?.toLowerCase().includes(search) ||
                    boat.make?.toLowerCase().includes(search) ||
                    boat.manufacturer?.toLowerCase().includes(search) ||
                    boat.modelYear?.toString().includes(search)
                );
            });
        },

        pagedBoats() {
            const start =
                (this.currentPage - 1) * this.pageSize;

            const end =
                start + this.pageSize;

            return this.filteredBoats.slice(start, end);
        },

        totalPages() {
            return Math.ceil(
                this.filteredBoats.length / this.pageSize
            );
        },

        startItem() {
            if (this.filteredBoats.length === 0) {
                return 0;
            }

            return (
                (this.currentPage - 1) *
                this.pageSize +
                1
            );
        },

        endItem() {
            return Math.min(
                this.currentPage * this.pageSize,
                this.filteredBoats.length
            );
        }
    },

    watch: {
        searchText() {
            this.currentPage = 1;
        }
    },

    template: `
        <details class="my-boats-details" open>

            <summary class="my-boats-summary">
                <span>My Boats</span>
            </summary>

            <div class="my-boats-content">

                <div class="my-boats-search">
                    <label for="myBoatsSearch">
                        Search My Boats
                    </label>

                    <input
                        id="myBoatsSearch"
                        type="text"
                        v-model="searchText"
                    />
                </div>

                <small class="my-boats-voice-help">
                    ⓘ Voice control users: You can act on the boat by saying
                    "Click Manage Boat LA-1234-AB" for example.
                </small>


                <div
                    v-if="pagedBoats.length > 0"
                    class="my-boats-list"
                >
                    <BoatCard
                        v-for="boat in pagedBoats"
                        :key="boat.boatId"
                        :boat="boat"
                    />
                </div>

                <div
                    v-else
                    class="my-boats-empty"
                >
                    No boats found.
                </div>


                <div class="my-boats-controls">

                    <div class="my-boats-showing">
                        Showing
                        <strong>{{ startItem }}</strong>
                        to
                        <strong>{{ endItem }}</strong>
                        of
                        <strong>{{ filteredBoats.length }}</strong>
                        items
                    </div>

                    <BoatPagination
                        v-if="totalPages > 1"
                        :current-page="currentPage"
                        :total-pages="totalPages"
                        @page-changed="currentPage = $event"
                    />

                </div>


                <RenewBoatPanel />

            </div>

        </details>
    `
};