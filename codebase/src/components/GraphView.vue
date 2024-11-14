<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { drawNodes } from "./node";
  import { drawEdges } from "./edge";
  import type { GNode, GEdge } from "../graph/types";
  import { Status } from "../graph/types";
  import { animateGraph } from "@/graph/graphAnimation";
  import { graphToAdjList } from "@/converters";
import { bfsWithTrace, dfsWithTrace } from "@/algorithms";

  let globalId: number = 0;
  let globalEdgeId: number = 0;

  const nodeR: number = 30;
  const nodes = ref<GNode[]>([]);
  const selected = ref<number[]>([]);
  const edges = ref<GEdge[]>([]);

  const canvas = ref<HTMLCanvasElement>();
  let isDragging = -1;

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
      isDragging = -1;
    });
    canvas.value.addEventListener("click", handleClick);
    canvas.value.addEventListener("mousemove", handleDrag);
  });

  function handleTraversal(type: string) {
    if (canvas.value){
      const ctx = canvas.value.getContext("2d");
      if(ctx){
        const adjacencyList = graphToAdjList(nodes.value, edges.value);
        if(type == 'bfs') {
          const trace = bfsWithTrace(adjacencyList, selected.value[0]);
          animateGraph(nodes.value, edges.value, trace, ctx, nodeR);
        } else if (type == 'dfs') {
          const trace = dfsWithTrace(adjacencyList, selected.value[0]);
          animateGraph(nodes.value, edges.value, trace, ctx, nodeR);
        }
        
      }
    }
  }

  const updateCurrentLines = (lines: number[]) => {
    currentLines.value = lines;
  };

  function handleMouseDown(event: MouseEvent) {
    let index = isIntersectingIndex(event.offsetX, event.offsetY);
    if (index != -1) {
      isDragging = index;
    }
  }

  //Need to optimize this better
  function handleDrag(event: MouseEvent) {
    if (isDragging != -1) {
      nodes.value[isDragging].x = event.offsetX;
      nodes.value[isDragging].y = event.offsetY;
      redraw();
    }
  }

  function handleClick(event: MouseEvent) {
    const coordinates: number[] = [event.offsetX, event.offsetY];
    // If nothing is intersecting, add a new node
    let index = isIntersectingIndex(coordinates[0], coordinates[1]);
    if (index == -1) {
      let newNode: GNode = {
        id: globalId,
        x: coordinates[0],
        y: coordinates[1],
        status: Status.default,
      };
      globalId += 1;
      nodes.value.push(newNode);
      redraw();
    }
  }

  function handleDoubleClick(event: MouseEvent) {
    const coordinates: number[] = [event.offsetX, event.offsetY];
    let index = isIntersectingIndex(coordinates[0], coordinates[1]);
    if (index != -1) {
      selected.value.push(nodes.value[index].id);
      nodes.value[index].status = Status.selected;
      if (selected.value.length == 2) {
        edges.value.push({
          id: globalEdgeId,
          from: selected.value[0],
          to: selected.value[1],
          type: "undirected",
          weight: 1,
          status: Status.selected
        });
        globalEdgeId += 1;

        for (let i = 0; i < nodes.value.length; i++) {
          if ((nodes.value[i].status = Status.selected)) {
            nodes.value[i].status = Status.default;
          }
        }
        selected.value = [];
      }
      redraw();
      return;
    }
  }

  function isIntersectingIndex(x: number, y: number) {
    for (let i = 0; i < globalId; i++) {
      let cur = nodes.value[i];

      if ((x - cur.x) ** 2 + (y - cur.y) ** 2 <= nodeR ** 2) {
        //return nodes.value[i].id, i;
        return i;
      }
    }
    return -1;
  }

  function redraw() {
    if (canvas.value) {
      const ctx = canvas.value.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
        drawEdges(ctx, nodes.value, edges.value);
        drawNodes(ctx, nodes.value, nodeR);
      }
    }
  }
</script>

<template>
  <main>
    <div style="background: red; width: 50px; height: 50px; position: absolute; top: 0"></div>
    <div :style="{
      width: '500px',
      height: '500px'
    }">
      <div 
        :style="{
          width: '500px',
          height: '500px'
        }"
      >
        <canvas
          :style="{
            width: '100%',
            height: '100%'
          }"
          ref="canvas"
          width="1000"
          height="500"
        ></canvas>
      </div>
      <!-- <div class="pseudo-code-container">
      <div
        v-for="(line, index) in pseudoCode"
        :key="index"
        :class="{ highlighted: currentLines.includes(index) }"
        :style="{
          paddingLeft: `${(line.match(/^(\s*)/)?.[0].length || 0) * 20}px`,
        }"
      >
        {{ line.trim() }}`
        </div>
      </div> -->
      <div class="dropdown">
        <button class="dropbtn">Algorithms</button>
        <div class="dropdown-content">
          <a href="#" @click="handleTraversal('bfs')">BFS</a>
          <a href="#" @click="handleTraversal('dfs')">DFS</a>
        </div>
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
  background-color: #04AA6D;
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
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
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
.dropdown-content a:hover {background-color: #ddd;
color: #3e8e41}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {display: block;}

/* Change the background color of the dropdown button when the dropdown content is shown */
.dropdown:hover .dropbtn {background-color: #3e8e41;}

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
