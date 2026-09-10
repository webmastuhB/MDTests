export default {
    name: "BoatPagination",

    props: {
        currentPage: {
            type: Number,
            required: true
        },

        totalPages: {
            type: Number,
            required: true
        }
    },

    emits: [
        "page-changed"
    ],

    computed: {
        visiblePages() {
            if (this.totalPages <= 7) {
                return Array.from(
                    { length: this.totalPages },
                    (_, index) => index + 1
                );
            }

            const pages = [];

            pages.push(1);

            if (this.currentPage <= 4) {
                pages.push(2, 3, 4, 5);
                pages.push("...");
                pages.push(this.totalPages);

                return pages;
            }

            if (
                this.currentPage >=
                this.totalPages - 3
            ) {
                pages.push("...");

                for (
                    let page = this.totalPages - 4;
                    page <= this.totalPages;
                    page++
                ) {
                    pages.push(page);
                }

                return pages;
            }

            pages.push("...");

            pages.push(
                this.currentPage - 1,
                this.currentPage,
                this.currentPage + 1
            );

            pages.push("...");
            pages.push(this.totalPages);

            return pages;
        }
    },

    methods: {
        goToPage(page) {
            if (
                page < 1 ||
                page > this.totalPages
            ) {
                return;
            }

            this.$emit(
                "page-changed",
                page
            );
        }
    },

    template: `
        <nav
            class="boat-pagination"
            aria-label="Results navigation"
        >

            <button
                type="button"
                class="boat-page-button"
                :disabled="currentPage === 1"
                aria-label="Previous page"
                @click="goToPage(currentPage - 1)"
            >
                &lt;
            </button>


            <template
                v-for="(page, index) in visiblePages"
                :key="index"
            >

                <span
                    v-if="page === '...'"
                    class="boat-page-ellipsis"
                >
                    ...
                </span>

                <button
                    v-else
                    type="button"
                    class="boat-page-button"
                    :class="{
                        'boat-page-current':
                            page === currentPage
                    }"
                    @click="goToPage(page)"
                >
                    {{ page }}
                </button>

            </template>


            <button
                type="button"
                class="boat-page-button"
                :disabled="currentPage === totalPages"
                aria-label="Next page"
                @click="goToPage(currentPage + 1)"
            >
                &gt;
            </button>

        </nav>
    `
};