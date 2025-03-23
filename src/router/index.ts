import { createRouter, createWebHistory } from "vue-router";

import baseRoutes from "./base";

const routes = [...baseRoutes];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
