import { App, createApp } from "vue";
import store from "./storeModule";

const vuexPlugin = {
  install: (app: App) => {
    app.use(store);
  },
};

export default vuexPlugin;
