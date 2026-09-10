import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

import MyBoats from "./MyBoats.js";
import { fakeBoatData } from "./MyBoats_testData.js";

createApp(MyBoats, {
    boats: fakeBoatData
}).mount("#my-boats-app");