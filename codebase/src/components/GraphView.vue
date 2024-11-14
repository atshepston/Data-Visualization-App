<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { drawNodes } from "./node";
  import { drawEdges } from "./edge";
  import type { GNode, GEdge } from "../graph/types";
  import { animateGraph } from "@/graph/graphAnimation";
  import { graphToAdjList } from "@/converters";
  import { bfsWithTrace, dfsWithTrace } from "@/algorithms";

  let newNodeId = 0;
  let newEdgeId = 0;

  const nodeRadius = 30;

  /**
   * node ids that are currently selected
   */
  const selectedNodeIds = ref<GNode["id"][]>([]);

  const nodes = ref<GNode[]>([]);
  const edges = ref<GEdge[]>([]);

  const canvas = ref<HTMLCanvasElement>();
  const draggingNode = ref<GNode>();

  const pseudoCode = ref([
    "do",
    " swapped = false",
    " for index = 1 to index_of_last_unsorted_element - 1",
    "  if left_element > right_element",
    "   swap(left_element, right_element)",
    "   swapped = true;",
    "while swapped",
  ]);

  const currentLines = ref<number[]>([]);

  onMounted(() => {
    if (!canvas.value) {
      return;
    }
    canvas.value.addEventListener("dblclick", handleDoubleClick);
    canvas.value.addEventListener("mousedown", handleMouseDown);
    canvas.value.addEventListener("mouseup", () => {
      draggingNode.value = undefined;
    });
    canvas.value.addEventListener("click", handleClick);
    canvas.value.addEventListener("mousemove", handleDrag);
  });

  function handleTraversal(algorithm: "bfs" | "dfs") {
    if (!canvas.value) return;
    const ctx = canvas.value.getContext("2d");
    if (!ctx) return;
    const adjacencyList = graphToAdjList(nodes.value, edges.value);
    const algoFn = algorithm === "bfs" ? bfsWithTrace : dfsWithTrace;
    const trace = algoFn(adjacencyList, selectedNodeIds.value[0]);
    animateGraph(nodes.value, edges.value, trace, ctx, nodeRadius);
  }

  function handleMouseDown(event: MouseEvent) {
    const nodeIndex = getNodeIndexByCoordinates(event.offsetX, event.offsetY);
    if (nodeIndex === -1) return;
    draggingNode.value = nodes.value[nodeIndex];
  }

  // Need to optimize this better
  function handleDrag(event: MouseEvent) {
    if (!draggingNode.value) return;
    draggingNode.value.x = event.offsetX;
    draggingNode.value.y = event.offsetY;
  }

  function handleClick(event: MouseEvent) {
    const { offsetX: x, offsetY: y } = event;

    // if nothing is intersecting, add a new node
    const index = getNodeIndexByCoordinates(x, y);
    if (index !== -1) return;
    const newNode: GNode = {
      id: newNodeId,
      x,
      y,
      status: "default",
    };
    newNodeId += 1;
    nodes.value.push(newNode);
  }

  function handleDoubleClick(event: MouseEvent) {
    const { offsetX: x, offsetY: y } = event;
    const index = getNodeIndexByCoordinates(x, y);
    if (index === -1) return;
    const node = nodes.value[index];
    selectedNodeIds.value.push(node.id);
    node.status = "selected";
    if (selectedNodeIds.value.length !== 2) return;
    const [selectedNode1, selectedNode2] = selectedNodeIds.value;
    addEdge(selectedNode1, selectedNode2);

    for (let i = 0; i < nodes.value.length; i++) {
      if ((nodes.value[i].status = "selected")) {
        nodes.value[i].status = "default";
      }
    }
    selectedNodeIds.value = [];
  }

  function addEdge(fromNodeId: GNode["id"], toNodeId: GNode["id"]) {
    edges.value.push({
      id: newEdgeId,
      from: fromNodeId,
      to: toNodeId,
      type: "undirected",
      weight: 1,
      status: "selected",
    });

    newEdgeId += 1;
  }

  function getNodeIndexByCoordinates(x: number, y: number) {
    for (let i = 0; i < newNodeId; i++) {
      let cur = nodes.value[i];

      if ((x - cur.x) ** 2 + (y - cur.y) ** 2 <= nodeRadius ** 2) {
        //return nodes.value[i].id, i;
        return i;
      }
    }
    return -1;
  }

  function redraw() {
    if (!canvas.value) return;
    const ctx = canvas.value.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
    drawEdges(ctx, nodes.value, edges.value);
    drawNodes(nodes.value, {
      ctx,
      nodeRadius,
    });
  }

  setInterval(() => {
    redraw();
  }, 1000 / 24);

  const connectionNodeId1 = ref('');
  const connectionNodeId2 = ref('');

  function createNewEdge() {
    const [node1Id, node2Id] = [Number(connectionNodeId1.value), Number(connectionNodeId2.value)];
    // TODO - add some validation logic to make sure that node1Id and node2Id are in the nodes array
    // and that they dont have an edge between them already
    addEdge(node1Id, node2Id);
    connectionNodeId1.value = '';
    connectionNodeId2.value = '';
  }
</script>

<template>
  <main>
    <div
      :style="{
        overflow: 'hidden',
        width: '1000px',
        height: '500px',
        border: '1px solid black',
        position: 'relative',
      }"
    >
      <canvas
        :style="{
          width: '100%',
          height: '100%',
        }"
        ref="canvas"
        width="1000"
        height="500"
      ></canvas>
    </div>
    <div style="display: flex; gap: 10px; margin: 15px 0px">
      <input
        v-model="connectionNodeId1"
        type="number"
        placeholder="Node 1"
      />
      <input
        v-model="connectionNodeId2"
        type="number"
        placeholder="Node 2"
      />
      <button @click="createNewEdge">Create Edge</button>
    </div>
    <div class="dropdown">
      <button class="dropbtn">Algorithms</button>
      <div class="dropdown-content">
        <a
          href="#"
          @click="handleTraversal('bfs')"
        >
          BFS
        </a>
        <a
          href="#"
          @click="handleTraversal('dfs')"
        >
          DFS
        </a>
      </div>
    </div>
  </main>
</template>

<style scoped>
  .center {
    margin: auto;
    padding: 10px;
  }

  /* Dropdown Button */
  .dropbtn {
    background-color: #04aa6d;
    color: white;
    padding: 16px;
    font-size: 16px;
    border: none;
  }

  /* The container <div> - needed to position the dropdown content */
  .dropdown {
    display: inline-block;
    height: 50px;
  }

  /* Dropdown Content (Hidden by Default) */
  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  /* Links inside the dropdown */
  .dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  /* Change color of dropdown links on hover */
  .dropdown-content a:hover {
    background-color: #ddd;
    color: #3e8e41;
  }

  /* Show the dropdown menu on hover */
  .dropdown:hover .dropdown-content {
    display: block;
  }

  /* Change the background color of the dropdown button when the dropdown content is shown */
  .dropdown:hover .dropbtn {
    background-color: #3e8e41;
  }

  /* .pseudo-code-container {
    background-color: #f7f9fc;
    overflow: auto;
    padding: 20px;
    border-radius: 8px;
    max-width: 100%;
    position: absolute;
    bottom: 50px;
    font-size: 14px;
    font-family: monospace;
  } */

  /* .highlighted {
    background-color: yellow;
  } */
</style>
