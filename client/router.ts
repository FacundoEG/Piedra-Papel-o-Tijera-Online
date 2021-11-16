import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));

router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/newroom", component: "newroom-page" },
  { path: "/enteroom", component: "enteroom-page" },
  { path: "/refused", component: "refused-page" },
  { path: "/waitingroom", component: "waiting-room" },
]);
