import { createWebHistory, createRouter } from "vue-router";
import GraphView from "./components/GraphView.vue";
import SortingView from "./sorting/components/SortingView.vue";

const routes = [
  {
    path: "/",
    redirect: "/graph",
  },
  {
    path: "/graph",
    name: "GraphView",
    component: GraphView,
  },
  {
    path: "/sorting",
    name: "SortingView",
    component: SortingView,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;