import { graphToAdjList } from "@/converters";
import type { GEdge, GNode } from "../graph/types";
const CIRCLER = 30;

export function drawEdges(
  ctx: CanvasRenderingContext2D,
  nodes: GNode[],
  edges: GEdge[]
) {
  // Make this not hard coded
  // Maybe optimize this using adjacency list later
  // TODO: Add bi-directional edges
  // TODO: Add dragging for self edges?
  for (let i = 0; i < edges.length; i++) {
    let to: number = edges[i].to;
    let from: number = edges[i].from;

    //Self Edge
    if (to == from) {
      let nodeCords: number[] = [];
      for (let x = 0; x < nodes.length; x++) {
        let cur = nodes[x];
        if (cur.id == to) {
          nodeCords = [cur.x, cur.y];
        }
      }
      //Maybe make angle opposite to the average of all other angles for that node
      drawSelfEdge(ctx, Math.PI, nodeCords[0], nodeCords[1], CIRCLER, edges[i]);
      //drawSelfEdge(ctx, (Math.PI / 2), nodeCords[0], nodeCords[1], CIRCLER, edges[i]);
      continue;
    }

    let toX = -1;
    let toY = -1;
    let fromX = -1;
    let fromY = -1;
    for (let x = 0; x < nodes.length; x++) {
      let cur = nodes[x];
      if (cur.id == to) {
        toX = cur.x;
        toY = cur.y;
      } else if (cur.id == from) {
        fromX = cur.x;
        fromY = cur.y;
      }
    }
    if (toX == -1 || toY == -1 || fromX == -1 || fromY == -1) {
      alert("One of these nodes does not exist");
      return;
    }
    if (edges[i].type == "undirected") {
      drawUndirectedEdge(ctx, fromX, fromY, toX, toY, edges[i], CIRCLER);
    } else if ((edges[i].type = "directed")) {
      drawDirectedEdge(ctx, fromX, fromY, toX, toY, edges[i], CIRCLER);
    }
  }
}

//Figure out why these are negative
function drawSelfEdge(
  ctx: CanvasRenderingContext2D,
  rad: number,
  x: number,
  y: number,
  r: number,
  edge: GEdge
) {
  rad = -rad;
  const startX = (r - 10) * Math.cos(rad) + x;
  const startY = (r - 10) * Math.sin(rad) + y;

  const SF = 70;

  const cx1 = startX + SF * Math.cos(rad) + SF * Math.sin(rad);
  const cy1 = startY + SF * Math.sin(rad) + SF * Math.cos(rad);

  const cx2 = startX + SF * Math.cos(rad) - SF * Math.sin(rad);
  const cy2 = startY + SF * Math.sin(rad) - SF * Math.cos(rad);

  ctx.beginPath();
  ctx.strokeStyle = edge.status;
  ctx.lineWidth = 3;
  ctx.moveTo(startX, startY);
  ctx.bezierCurveTo(cx1, cy1, cx2, cy2, startX, startY);
  ctx.stroke();
  ctx.strokeStyle = "black";

  ctx.lineWidth = 1;
  const midPoint = [
    (cx1 + cx2) / 2 - Math.cos(rad) * 20,
    (cy1 + cy2) / 2 - Math.sin(rad) * 20,
  ];

  addEdgeWeight(ctx, midPoint[0], midPoint[1], edge.weight);
}

function drawDirectedEdge(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  edge: GEdge,
  circleR: number
) {
  const rad = Math.atan2(fromY - toY, fromX - toX);
  const startX = circleR * Math.cos(rad) + fromX;
  const startY = circleR * Math.sin(rad) + fromY;
  const endX = circleR * Math.cos(rad) + toX;
  const endY = circleR * Math.sin(rad) + toY;

  const triEndX = (circleR + 15) * Math.cos(rad) + toX;
  const triEndY = (circleR + 15) * Math.sin(rad) + toY;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.strokeStyle = edge.status;
  ctx.lineTo(endX, endY);
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.strokeStyle = "black";

  const triTipX = -15 * Math.cos(rad) + triEndX;
  const triTipY = -15 * Math.sin(rad) + triEndY;
  const triLX = 10 * Math.cos(rad + Math.PI / 2) + triEndX;
  const triLY = 10 * Math.sin(rad + Math.PI / 2) + triEndY;
  const triRX = 10 * Math.cos(rad - Math.PI / 2) + triEndX;
  const triRY = 10 * Math.sin(rad - Math.PI / 2) + triEndY;

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(triLX, triLY);
  ctx.lineTo(triRX, triRY);
  ctx.lineTo(triTipX, triTipY);
  ctx.fillStyle = "black";
  ctx.fill();

  addEdgeWeight(ctx, (fromX + toX) / 2, (fromY + toY) / 2, edge.weight);
}

function drawUndirectedEdge(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  edge: GEdge,
  circleR: number
) {
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.lineWidth = 3;
  ctx.strokeStyle = edge.status;
  ctx.stroke();
  ctx.strokeStyle = "black";

  addEdgeWeight(ctx, midX, midY, edge.weight);
}

// TODO: Make these clickable maybe
function addEdgeWeight(
  ctx: CanvasRenderingContext2D,
  midX: number,
  midY: number,
  weight: number
) {
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(midX, midY, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();

  ctx.font = "15px Arial";
  ctx.fillStyle = "black";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(weight.toString(), midX, midY);
}
