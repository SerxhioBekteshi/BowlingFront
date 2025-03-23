import Home from "./Home/index.vue";
import Frame from "./Home/Frame.vue";
import GameResults from "./Home/GameResults.vue";

const baseRoutes = [
  {
    path: "/",
    component: Home,
    name: "Landing Page",
  },
  {
    path: "/frame/:gameId/:id",
    component: Frame,
    name: "Frame",
  },
  {
    path: "/game/:gameId/results",
    component: GameResults,
    name: "GameResults",
  },
  { path: "/:pathMatch(.*)", redirect: "/" },
];

export default baseRoutes;
