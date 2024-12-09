import { graphToAdjList } from "@/converters";
import type { GEdge, GNode } from "../graph/types";
import { STATUS_TO_COLOR } from "../graph/types";
const CIRCLER = 30;

type nodePair = {
  to: number;
  from: number;
};

export function drawEdges(
  ctx: CanvasRenderingContext2D,
  nodes: GNode[],
  edges: GEdge[]
) {
  let prevPairs: nodePair[] = [];

  for (let i = 0; i < edges.length; i++) {
    let to: number = edges[i].to;
    let from: number = edges[i].from;
    prevPairs.push({ to: to, from: from });

    //Self Edge
    if (to == from) {
      let nodeCords: number[] = [];
      for (let x = 0; x < nodes.length; x++) {
        let cur = nodes[x];
        if (cur.id == to) {
          nodeCords = [cur.x, cur.y];
        }
      }
      drawSelfEdge(ctx, Math.PI, nodeCords[0], nodeCords[1], edges[i], CIRCLER);
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
      let secondEdge = false;
      for (let p = 0; p < prevPairs.length; p++) {
        if (
          prevPairs[p].from == edges[i].to &&
          prevPairs[p].to == edges[i].from
        ) {
          secondEdge = true;
        }
      }
      if (secondEdge) {
        drawSecondDirectedEdge(ctx, fromX, fromY, toX, toY, edges[i], CIRCLER);
      } else {
        drawDirectedEdge(ctx, fromX, fromY, toX, toY, edges[i], CIRCLER);
      }
    }
  }
}

//Figure out why these are negative
function drawSelfEdge(
  ctx: CanvasRenderingContext2D,
  rad: number,
  x: number,
  y: number,
  edge: GEdge,
  circleR: number
) {
  rad = -rad;
  const startX = (circleR - 10) * Math.cos(rad) + x;
  const startY = (circleR - 10) * Math.sin(rad) + y;

  const SF = 70;

  const cx1 = startX + SF * Math.cos(rad) + SF * Math.sin(rad);
  const cy1 = startY + SF * Math.sin(rad) + SF * Math.cos(rad);

  const cx2 = startX + SF * Math.cos(rad) - SF * Math.sin(rad);
  const cy2 = startY + SF * Math.sin(rad) - SF * Math.cos(rad);

  ctx.beginPath();
  ctx.strokeStyle = STATUS_TO_COLOR[edge.status];
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
  const startX = -circleR * Math.cos(rad) + fromX;
  const startY = -circleR * Math.sin(rad) + fromY;
  const endX = circleR * Math.cos(rad) + toX;
  const endY = circleR * Math.sin(rad) + toY;

  const triEndX = (circleR + 15) * Math.cos(rad) + toX;
  const triEndY = (circleR + 15) * Math.sin(rad) + toY;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.strokeStyle = STATUS_TO_COLOR[edge.status];
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

function drawSecondDirectedEdge(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  edge: GEdge,
  circleR: number
) {
  const rad = Math.atan2(fromY - toY, fromX - toX);
  const startX = -circleR * Math.cos(rad) + fromX;
  const startY = -circleR * Math.sin(rad) + fromY;
  const endX = circleR * Math.cos(rad) + toX;
  const endY = circleR * Math.sin(rad) + toY;

  const midPoint = [
    (startX + endX) / 2 + 50 * Math.cos(rad + Math.PI / 2),
    (startY + endY) / 2 + 50 * Math.sin(rad + Math.PI / 2),
  ];

  //Control point for the second curve
  const cx1 = midPoint[0] + 50 * Math.cos(rad + Math.PI / 2);
  const cy1 = midPoint[1] + 50 * Math.sin(rad + Math.PI / 2);

  ctx.beginPath();
  ctx.strokeStyle = STATUS_TO_COLOR[edge.status];
  ctx.lineWidth = 3;
  ctx.moveTo(startX, startY);
  ctx.quadraticCurveTo(cx1, cy1, endX, endY);
  ctx.stroke();
  ctx.strokeStyle = "black";

  const triRad = Math.atan2(cy1 - endY, cx1 - endX);

  const triEndX = 15 * Math.cos(triRad) + endX;
  const triEndY = 15 * Math.sin(triRad) + endY;

  const triTipX = endX;
  const triTipY = endY;
  const triLX = 10 * Math.cos(triRad + Math.PI / 2) + triEndX;
  const triLY = 10 * Math.sin(triRad + Math.PI / 2) + triEndY;
  const triRX = 10 * Math.cos(triRad - Math.PI / 2) + triEndX;
  const triRY = 10 * Math.sin(triRad - Math.PI / 2) + triEndY;

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(triLX, triLY);
  ctx.lineTo(triRX, triRY);
  ctx.lineTo(triTipX, triTipY);
  ctx.fillStyle = "black";
  ctx.fill();

  addEdgeWeight(ctx, midPoint[0], midPoint[1], edge.weight);
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
  ctx.strokeStyle = STATUS_TO_COLOR[edge.status];
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
