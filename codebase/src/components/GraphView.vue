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
  const executionSpeed = ref();
  const executionSpeedMessage = ref();
  const orderOfVisitedNodes = ref("");

  //Edge weight for the edge currently selected
  const selectedEdgeWeight = ref("");
  const edgeType = ref<"directed" | "undirected">("undirected");

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

  async function handleTraversal(algorithm: "bfs" | "dfs") {
    if (!canvas.value) return;
    const ctx = canvas.value.getContext("2d");
    if (!ctx) return;
    if (executionSpeed.value < 0.5 || executionSpeed.value === undefined)
      executionSpeed.value = 1;
    const adjacencyList = graphToAdjList(nodes.value, edges.value);
    const algoFn = algorithm === "bfs" ? bfsWithTrace : dfsWithTrace;
    const trace = algoFn(adjacencyList, selectedNodeIds.value[0]);
    animateGraph(
      nodes.value,
      edges.value,
      trace.trace,
      ctx,
      nodeRadius,
      executionSpeed.value
    );
    orderOfVisitedNodes.value = trace.visited.toString();
  }

  function speedIsValid() {
    if (executionSpeed.value < 0.5 && executionSpeed.value != undefined) {
      executionSpeedMessage.value = "(Delay must be >= .5)";
      return false;
    }
    executionSpeedMessage.value = "(Enter time in seconds)";
    return true;
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
    //addEdge(selectedNode1, selectedNode2);

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
      type: edgeType.value,
      weight: 1,
      status: "selected",
    });

    newEdgeId += 1;
  }

  function getNodeIndexByCoordinates(x: number, y: number) {
    for (let i = 0; i < newNodeId; i++) {
      let cur = nodes.value[i];

      if ((x - cur.x) ** 2 + (y - cur.y) ** 2 <= nodeRadius ** 2) {
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
  function toggleEdgeType() {
    if (edgeType.value == "directed") {
      edgeType.value = "undirected";
    } else {
      edgeType.value = "directed";
    }
    clearAll();
  }

  setInterval(() => {
    redraw();
  }, 1000 / 60);

  const connectionNodeId1 = ref("");
  const connectionNodeId2 = ref("");

  //Right now this conflicts with bi-directional edges
  // TODO: Allow for bi-directional edges
  function createNewEdge() {
    if (connectionNodeId1.value === "" || connectionNodeId2.value === "")
      return;
    const [node1Id, node2Id] = [
      Number(connectionNodeId1.value),
      Number(connectionNodeId2.value),
    ];

    const node1InGraph = nodes.value.some((n) => n.id === node1Id);
    const node2InGraph = nodes.value.some((n) => n.id === node2Id);
    if (!node1InGraph || !node2InGraph) return;

    const edgeExistsOnPath = edges.value.some(
      (e) =>
        (e.from === node1Id && e.to === node2Id) ||
        (e.from === node2Id && e.to === node1Id)
    );
    if (edgeExistsOnPath) return;

    addEdge(node1Id, node2Id);

    connectionNodeId1.value = "";
    connectionNodeId2.value = "";
  }

  function removeEdge() {
    const [node1Id, node2Id] = [
      Number(connectionNodeId1.value),
      Number(connectionNodeId2.value),
    ];
    const edgeExistsOnPath = edges.value.some(
      (e) =>
        (e.from === node1Id && e.to === node2Id) ||
        (e.from === node2Id && e.to === node1Id)
    );
    if (!edgeExistsOnPath) return;

    edges.value = edges.value.filter(
      (e) =>
        !(e.from === node1Id && e.to === node2Id) &&
        !(e.from === node2Id && e.to === node1Id)
    );

    connectionNodeId1.value = "";
    connectionNodeId2.value = "";
  }

  function editEdgeWeight() {
    const [node1Id, node2Id] = [
      Number(connectionNodeId1.value),
      Number(connectionNodeId2.value),
    ];
    const edgeExistsOnPath = edges.value.some(
      (e) =>
        (e.from === node1Id && e.to === node2Id) ||
        (e.from === node2Id && e.to === node1Id)
    );
    if (!edgeExistsOnPath) return;
    edges.value.forEach((e) => {
      if (e.from == node1Id && e.to == node2Id) {
        e.weight = Number(selectedEdgeWeight.value);
      }
    });
    redraw();
  }

  function clearAll() {
    if (canvas.value) {
      newNodeId = 0;
      newEdgeId = 0;
      nodes.value = [];
      selectedNodeIds.value = [];
      edges.value = [];
      redraw();
    }
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
        margin: 'auto',
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
    <div
      style="display: flex; gap: 10px; margin: 15px 0; justify-content: center"
    >
      <input
        style="width: 70px; border: solid 1px black; border-radius: 5px"
        min="0"
        v-model="connectionNodeId1"
        type="number"
        placeholder="Node 1"
      />
      <input
        style="width: 70px; border: solid 1px black; border-radius: 5px"
        min="0"
        v-model="connectionNodeId2"
        type="number"
        placeholder="Node 2"
      />
      <button
        id="createEdge"
        @click="createNewEdge"
      >
        Create Edge
      </button>
      <button
        id="removeEdge"
        @click="removeEdge"
      >
        Remove Edge
      </button>
      <button
        id="clearAll"
        @click="clearAll"
      >
        Clear All
      </button>
      <input
        style="width: 80px; border: solid 1px black; border-radius: 5px"
        id="edgeWeight"
        type="number"
        v-model="selectedEdgeWeight"
        @change="editEdgeWeight"
        placeholder="Edge Weight"
      />
      <button @click="toggleEdgeType">Toggle directed/undirected</button>
    </div>
    <div
      style="
        display: flex;
        gap: 20px;
        margin: auto 0 auto auto;
        justify-content: center;
      "
    >
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
      <div
        style="
          display: flex;
          height: 50px;
          flex-direction: column;
          margin: auto 0;
        "
      >
        <input
          style="
            width: 70px;
            margin: auto;
            border: solid 1px black;
            border-radius: 5px;
          "
          type="number"
          min=".5"
          placeholder="Delay (s)"
          v-model="executionSpeed"
        />
        <label
          v-if="speedIsValid()"
          style="font-size: 13px"
        >
          {{ executionSpeedMessage }}
        </label>
        <label
          v-else
          style="font-size: 13px"
        >
          {{ executionSpeedMessage }}
        </label>
      </div>
      <p
        style="
          background-color: #04aa6d;
          width: auto;
          height: auto;
          padding: 5px;
          font-size: 20px;
          color: white;
          border-radius: 5px;
          margin: auto 0;
        "
      >
        Order Visited: [{{ orderOfVisitedNodes }}]
      </p>
    </div>
  </main>
</template>
<style scoped>
  #removeEdge {
    background-color: rgba(255, 0, 0, 0.6);
    border: none;
    border-radius: 5px;
    color: white;
  }

  #createEdge {
    background-color: #04aa6d;
    border: none;
    border-radius: 5px;
    color: white;
  }

  #clearAll {
    background-color: #3c53a4;
    border: none;
    border-radius: 5px;
    color: white;
  }

  #clearAll:hover {
    background-color: rgb(30, 30, 193);
    border: none;
    border-radius: 5px;
    color: white;
    transform: scale(105%);
  }

  #removeEdge:hover {
    background-color: rgb(193, 30, 30);
    border: none;
    border-radius: 5px;
    transform: scale(105%);
  }

  #createEdge:hover {
    background-color: #3e8e41;
    border: none;
    border-radius: 5px;
    transform: scale(105%);
  }

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
    border-radius: 5px;
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
</style>
