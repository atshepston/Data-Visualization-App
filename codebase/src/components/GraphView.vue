<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { drawNodes } from "./node";
  import { drawEdges } from "./edge";
  import type { GNode, GEdge } from "../graph/types";
  import { animateBFSandDFS, animateDijkstras } from "@/graph/graphAnimation";
  import { graphToAdjList } from "@/converters";
  import { bfsWithTrace, dfsWithTrace, dijkstraWithTrace } from "@/algorithms";

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
  const orderOfVisitedNodes = ref("");
  const dijkstraNodeCosts = ref("");
  const selectedAlgorithm = ref("");
  const deletedNodeOffset = ref(0);
  const edgeTypeToggle = ref("Directed");

  //Edge weight for the edge currently selected
  const edgeType = ref<"directed" | "undirected">("undirected");
  const selectedEdge = ref<GEdge>();
  const newWeight = ref("");

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

  async function handleTraversal(algorithm: "bfs" | "dfs" | "dijkstra") {
    if (!canvas.value) return;
    const ctx = canvas.value.getContext("2d");
    if (!ctx) return;
    if (executionSpeed.value < 0.5 || executionSpeed.value === undefined)
      executionSpeed.value = 1;
    changeSelectedAlgorithm(algorithm);
    const adjacencyList = graphToAdjList(nodes.value, edges.value);
    let algoFn;
    if (algorithm === "bfs" || algorithm === "dfs") {
      algoFn = algorithm === "bfs" ? bfsWithTrace : dfsWithTrace;
      const trace = algoFn(adjacencyList, selectedNodeIds.value[0]);
      animateBFSandDFS(
        nodes.value,
        edges.value,
        trace.trace,
        ctx,
        nodeRadius,
        executionSpeed.value
      );
      orderOfVisitedNodes.value =
        "Order Visited: [" + trace.visited.toString() + "]";
    } else {
      algoFn = dijkstraWithTrace;
      const trace = algoFn(nodes.value, edges.value, selectedNodeIds.value[0]);
      await animateDijkstras(
        nodes.value,
        edges.value,
        trace.trace,
        ctx,
        nodeRadius,
        executionSpeed.value,
        updateDijkstraNodeCosts
      );
      dijkstraNodeCosts.value = `Final Costs:\n${JSON.stringify(
        trace.distances,
        null,
        2
      )}`;
    }
  }

  function changeSelectedAlgorithm(newAlgorithm: string) {
    selectedAlgorithm.value = newAlgorithm;
  }

  const updateDijkstraNodeCosts = (
    nodeID: number,
    oldNodeCost: number,
    newNodeCost: number
  ) => {
    dijkstraNodeCosts.value = `Node: ${nodeID.toString()} | Old Cost: ${oldNodeCost.toString()} | New Cost: ${newNodeCost.toString()}`;
  };

  function handleMouseDown(event: MouseEvent) {
    const nodeIndex = getNodeIndexByCoordinates(event.offsetX, event.offsetY);
    if (nodeIndex === -1) return;
    draggingNode.value = nodes.value[nodeIndex];
  }

  function handleDrag(event: MouseEvent) {
    if (!draggingNode.value) return;
    draggingNode.value.x = event.offsetX;
    draggingNode.value.y = event.offsetY;
  }

  function handleClick(event: MouseEvent) {
    const { offsetX: x, offsetY: y } = event;
    if (selectedEdge.value) {
      selectedEdge.value.status = "default";
    }

    // if nothing is intersecting, add a new node
    const nodeIndex = getNodeIndexByCoordinates(x, y);
    const edgeIndex = getEdgeIndexByCoordinates(x, y);
    if (edgeIndex != -1) {
      return;
    }
    if (nodeIndex != -1) return;
    const newNode: GNode = {
      id: newNodeId,
      x,
      y,
      status: "default",
    };
    newNodeId += 1;
    nodes.value.push(newNode);
    redraw();
  }

  function handleDoubleClick(event: MouseEvent) {
    const { offsetX: x, offsetY: y } = event;
    const index = getNodeIndexByCoordinates(x, y);
    const edgeIndex = getEdgeIndexByCoordinates(x, y);
    if (selectedEdge.value) {
      selectedEdge.value.status = "default";
    }
    if (edgeIndex != -1) {
      selectedEdge.value = edges.value[edgeIndex];
      selectedEdge.value.status = "selected";
      return;
    }
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
      status: "default",
    });
    newEdgeId += 1;
  }

  function getNodeIndexByCoordinates(x: number, y: number) {
    for (let i = 0; i < newNodeId - deletedNodeOffset.value; i++) {
      let cur = nodes.value[i];

      if ((x - cur.x) ** 2 + (y - cur.y) ** 2 <= nodeRadius ** 2) {
        return i;
      }
    }
    return -1;
  }

  // TODO: Change hitbox so it doesn't overlap node
  function getEdgeIndexByCoordinates(x: number, y: number) {
    for (let i = 0; i < edges.value.length; i++) {
      let edge = edges.value[i];
      let fromX = -1;
      let fromY = -1;
      let toX = -1;
      let toY = -1;
      for (let x = 0; x < nodes.value.length; x++) {
        let cur = nodes.value[x];
        if (cur.id == edge.to) {
          toX = cur.x;
          toY = cur.y;
        } else if (cur.id == edge.from) {
          fromX = cur.x;
          fromY = cur.y;
        }
      }
      if (toX == -1 || toY == -1 || fromX == -1 || fromY == -1) {
        alert("One of these nodes does not exist");
        return -1;
      }
      const rad = Math.atan2(fromY - toY, fromX - toX);

      const startX = 30 * Math.cos(rad) + fromX;
      const startY = 30 * Math.sin(rad) + fromY;
      const endX = 30 * Math.cos(rad) + toX;
      const endY = 30 * Math.sin(rad) + toY;
      const distFromEdge = 15;
      const x1 = distFromEdge * Math.cos(rad + Math.PI / 2) + startX;
      const y1 = distFromEdge * Math.sin(rad + Math.PI / 2) + startY;
      const x2 = distFromEdge * Math.cos(rad + (3 * Math.PI) / 2) + startX;
      const y2 = distFromEdge * Math.sin(rad + (3 * Math.PI) / 2) + startY;
      const x3 = distFromEdge * Math.cos(rad + Math.PI / 2) + endX;
      const y3 = distFromEdge * Math.sin(rad + Math.PI / 2) + endY;
      const x4 = distFromEdge * Math.cos(rad + (3 * Math.PI) / 2) + endX;
      const y4 = distFromEdge * Math.sin(rad + (3 * Math.PI) / 2) + endY;
      const rectArea =
        calcArea(x1, y1, x2, y2, x3, y3) + calcArea(x1, y1, x4, y4, x3, y3);
      const APD = calcArea(x1, y1, x, y, x4, y4);
      const DPC = calcArea(x4, y4, x, y, x3, y3);
      const CBP = calcArea(x3, y3, x2, y2, x, y);
      const PBA = calcArea(x, y, x2, y2, x1, y1);
      const sum = APD + DPC + CBP + PBA;
      if (sum > rectArea) {
        continue;
      } else {
        return i;
      }
    }
    return -1;
  }

  function calcArea(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ) {
    return 0.5 * Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
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
      edgeTypeToggle.value = "Directed";
    } else {
      edgeType.value = "directed";
      edgeTypeToggle.value = "Undirected";
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
    if (selectedEdge.value != null) {
      const to = selectedEdge.value.to;
      const from = selectedEdge.value.from;
      edges.value = edges.value.filter(
        (e) => !(e.from === from && e.to === to)
      );
    }

    connectionNodeId1.value = "";
    connectionNodeId2.value = "";
  }

  function editEdgeWeight() {
    if (selectedEdge.value != null) {
      selectedEdge.value.weight = Number(newWeight.value);
    }

    redraw();
  }

  function removeNode() {
    const nodeToBeRemoved = selectedNodeIds.value[0];
    if (nodeToBeRemoved == null) return;
    console.log(nodeToBeRemoved);
    const newNodes = nodes.value.filter((node) => node.id !== nodeToBeRemoved);
    const newEdges = edges.value.filter(
      (edge) => edge.from !== nodeToBeRemoved && edge.to !== nodeToBeRemoved
    );
    selectedNodeIds.value = [];
    deletedNodeOffset.value++;
    nodes.value = newNodes;
    edges.value = newEdges;
    redraw();
  }

  function clearAll() {
    if (canvas.value) {
      newNodeId = 0;
      newEdgeId = 0;
      nodes.value = [];
      selectedNodeIds.value = [];
      edges.value = [];
      deletedNodeOffset.value = 0;
      orderOfVisitedNodes.value = "Create a new graph";
      dijkstraNodeCosts.value = "Create a new graph";
      selectedEdge.value = undefined;
      connectionNodeId1.value = "";
      connectionNodeId2.value = "";
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
        background: '#eeee',
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
      style="
        display: flex;
        gap: 10px;
        margin: 0 0;
        justify-content: center;
        padding: 10px;
      "
    >
      <div
        class="dropdown"
        style="margin: auto 0"
      >
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
          <a
            href="#"
            @click="handleTraversal('dijkstra')"
          >
            Dijkstra's
          </a>
        </div>
      </div>
      <form
        @submit.prevent
        style="margin: auto 0"
      >
        <input
          style="
            width: 60px;
            border: solid 1px black;
            border-radius: 5px;
            margin-right: 10px;
          "
          min="0"
          v-model="connectionNodeId1"
          type="number"
          placeholder="Node 1"
          id="nodeInput1"
        />
        <input
          style="width: 60px; border: solid 1px black; border-radius: 5px"
          min="0"
          v-model="connectionNodeId2"
          type="number"
          placeholder="Node 2"
        />
        <div style="display: flex; flex-direction: column; margin-top: 3px">
          <button
            type="submit"
            id="createEdge"
            @click="createNewEdge"
          >
            Create Edge
          </button>
        </div>
      </form>
      <div
        class="removeButtons"
        style="
          display: flex;
          flex-direction: column;
          margin: auto 0;
          justify-content: center;
        "
      >
        <button
          id="removeEdge"
          @click="removeEdge"
          style="margin-bottom: 5px"
        >
          Remove Edge
        </button>
        <button
          id="removeNode"
          @click="removeNode"
        >
          Remove Node
        </button>
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
            width: 95px;
            border: solid 1px black;
            border-radius: 5px;
            height: 15px;
            margin: auto 0;
          "
          id="edgeWeight"
          type="number"
          v-model="newWeight"
          @change="editEdgeWeight"
          placeholder="Edge Weight"
        />
        <input
          style="
            width: 95px;
            margin: auto;
            border: solid 1px black;
            border-radius: 5px;
          "
          type="number"
          min=".5"
          placeholder="Delay (s)"
          v-model="executionSpeed"
        />
      </div>
      <div
        style="
          display: flex;
          height: 50px;
          flex-direction: column;
          margin: auto 0;
        "
      >
        <button
          id="clearAll"
          @click="clearAll"
          style="height: 20px; margin: auto 0"
        >
          Clear All
        </button>

        <button
          id="toggle"
          @click="toggleEdgeType"
          style="height: 20px; margin: auto 0"
        >
          {{ edgeTypeToggle }}
        </button>
      </div>
    </div>
    <div
      style="
        display: flex;
        gap: 20px;
        margin: auto 0 auto auto;
        justify-content: center;
      "
    >
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
        v-if="selectedAlgorithm == 'bfs' || selectedAlgorithm == 'dfs'"
      >
        {{ orderOfVisitedNodes }}
      </p>
      <p
        style="
          background-color: #04aa6d;
          width: px;
          height: auto;
          padding: 5px;
          font-size: 20px;
          color: white;
          border-radius: 5px;
          margin: auto 0;
        "
        v-else-if="selectedAlgorithm == 'dijkstra'"
      >
        {{ dijkstraNodeCosts }}
      </p>
    </div>
    <div
      style="
        margin: 20px auto;
        display: flex;
        justify-content: center;
        border: solid black 2px;
        max-width: 800px;
        border-radius: 10px;
      "
    >
      <ul
        style="
          font-size: 20px;
          background-color: #04aa6d;
          box-sizing: border-box;
          margin: 0px;
          border-radius: 8px;
          color: white;
          padding: 5px 20px;
        "
      >
        <li>Click within the borders to create a node</li>
        <li>Double click on a node to select it</li>
        <li>Click and hold down on a node to drag it around</li>
        <li>
          To add or remove an edge between two nodes, enter the node values and
          press the corresponding button or press enter
        </li>
        <li>
          To edit an edge weight, click on the edge and enter a new value in the
          input box
        </li>
        <li>
          When toggling between directed and undirected edges, the graph will
          clear
        </li>
        <li>To delete the graph, select "Clear All"</li>
        <li>
          To change the speed of the animation, enter a number (in seconds) in
          the delay input box greater than .5
        </li>
      </ul>
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

  #removeNode {
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

  #removeNode:hover {
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

  #toggle {
    background-color: #3c53a4;
    border: none;
    border-radius: 5px;
    color: white;
  }

  #toggle:hover {
    background-color: rgb(30, 30, 193);
    border: none;
    border-radius: 5px;
    color: white;
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
    padding: 10px;
    margin: auto 0;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    height: 41px;
  }

  /* The container <div> - needed to position the dropdown content */
  .dropdown {
    display: inline-block;
    height: auto;
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
