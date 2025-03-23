import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import PrimeVue from "primevue/config";
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css";
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import Tooltip from "primevue/tooltip";
import vuexPlugin from "./store/vuexStore/vuexPlugin";
import ToastService from "primevue/toastservice";

const app = createApp(App);

// Initialize Vuex store
function initializeApp() {
  vuexPlugin.install(app);
  app.use(vuexPlugin);
  app.use(router);
  app.use(ToastPlugin, { position: "top" });
  app.use(PrimeVue, {
    ripple: true,
  });
  app.use(ToastService).directive("tooltip", Tooltip);
  app.mount("#app");
}

initializeApp();
