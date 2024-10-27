<script setup lang="ts">
import { onMounted, ref } from "vue";
import { drawNodes } from "./components/node";
import { drawEdges } from "./components/edge";
import type { Gnode, GEdge } from "./graph/types";
import { Status } from "./graph/types";

let globalId: number = 0;
let globalEdgeId: number = 0;

const nodeR: number = 30;
const nodes = ref<Gnode[]>([]);
const selected = ref<string[]>([]);
const edges = ref<GEdge[]>([]);

const canvas = ref<HTMLCanvasElement>();
let isDragging = false;

onMounted(() => {
  if (!canvas.value) {
    return;
  }
  canvas.value.addEventListener("dblclick", handleClick);
  canvas.value.addEventListener("mousedown", () => {
    isDragging = true;
  });
  canvas.value.addEventListener("mouseup", () => {
    isDragging = false;
  });
  canvas.value.addEventListener("mousemove", handleDrag);
});

//Need to optimize this better
function handleDrag(event: MouseEvent) {
  if (isDragging) {
    const coordinates: number[] = [event.offsetX, event.offsetY];
    let potentialIntersection = isIntersecting(coordinates[0], coordinates[1]);
    if (potentialIntersection != -1) {
      for (let i = 0; i < nodes.value.length; i++) {
        if (nodes.value[i].id == potentialIntersection) {
          nodes.value[i].x = coordinates[0];
          nodes.value[i].y = coordinates[1];
          redraw();
        }
      }
    }
  }
}

function handleClick(event: MouseEvent) {
  const coordinates: number[] = [event.offsetX, event.offsetY];
  let potentialIntersection = isIntersecting(coordinates[0], coordinates[1]);
  if (potentialIntersection != -1) {
    for (let i = 0; i < nodes.value.length; i++) {
      if (nodes.value[i].id == potentialIntersection) {
        nodes.value[i].status = Status.selected;
        selected.value.push(nodes.value[i].id);
      }
    }
    if (selected.value.length == 2) {
      edges.value.push({
        id: globalEdgeId.toString(),
        from: selected.value[0],
        to: selected.value[1],
        type: "undirected",
        weight: 1,
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
  let newNode: Gnode = {
    id: globalId.toString(),
    x: coordinates[0],
    y: coordinates[1],
    status: Status.default,
  };
  globalId += 1;
  nodes.value.push(newNode);
  redraw();
}

function isIntersecting(x: number, y: number) {
  for (let i = 0; i < globalId; i++) {
    let cur = nodes.value[i];

    if ((x - cur.x) ** 2 + (y - cur.y) ** 2 <= nodeR ** 2) {
      return nodes.value[i].id;
    }
  }
  return -1;
}

//function isIntersecting(x: number, y: number) {
//  for (let i = 0; i < globalId; i++) {
//    let cur = nodes.value[i];
//
//    if ((x - cur.x) ** 2 + (y - cur.y) ** 2 <= nodeR ** 2) {
//      nodes.value[i].status = Status.selected;
//      selected.value.push(nodes.value[i].id);
//      if (selected.value.length == 2) {
//        edges.value.push({
//          id: globalEdgeId.toString(),
//          from: selected.value[0],
//          to: selected.value[1],
//          type: "undirected",
//          weight: 1,
//        });
//        globalEdgeId += 1;
//
//        for (let i = 0; i < nodes.value.length; i++) {
//          if ((nodes.value[i].status = Status.selected)) {
//            nodes.value[i].status = Status.default;
//          }
//        }
//        selected.value = [];
//      }
//
//      redraw();
//      return true;
//    }
//  }
//
//  return false;
//}

function redraw() {
  if (canvas.value) {
    const ctx = canvas.value.getContext("2d");
    ctx?.clearRect(0, 0, canvas.value.width, canvas.value.height);
    drawEdges(nodes.value, edges.value);
    drawNodes(nodes.value, nodeR);
  }
}
</script>

<template>
  <main>
    <div id="outer">
      <div id="inner">
        <canvas id="GraphArea" ref="canvas" width="2000" height="1000">
        </canvas>
      </div>
    </div>
  </main>
</template>

<style scoped>
.center {
  margin: auto;
  padding: 10px;
}
#inner {
  border: 0.05em solid black;
}

#outer {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
