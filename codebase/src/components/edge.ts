import type { GEdge, GNode } from "../graph/types";
const CIRCLER = 30;

export function drawEdges(
  ctx: CanvasRenderingContext2D,
  nodes: GNode[],
  edges: GEdge[]
) {
  // Make this not hard coded
  //const canvas: HTMLCanvasElement = document.getElementById("GraphArea") as HTMLCanvasElement;
  //const ctx = canvas.getContext("2d");
  // Maybe optimize this using adjacency list later
  if (ctx) {
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
        drawSelfEdge(
          ctx,
          Math.PI,
          nodeCords[0],
          nodeCords[1],
          CIRCLER,
          edges[i]
        );
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
      //drawDirectedEdge(ctx, fromX, fromY, toX, toY, edges[i], CIRCLER);
      drawUndirectedEdge(ctx, fromX, fromY, toX, toY, edges[i], CIRCLER);
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
  let startX = (r - 10) * Math.cos(rad) + x;
  let startY = (r - 10) * Math.sin(rad) + y;

  const SF = 70;

  let cx1 = startX + SF * Math.cos(rad) + SF * Math.sin(rad);
  let cy1 = startY + SF * Math.sin(rad) + SF * Math.cos(rad);

  let cx2 = startX + SF * Math.cos(rad) - SF * Math.sin(rad);
  let cy2 = startY + SF * Math.sin(rad) - SF * Math.cos(rad);

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.moveTo(startX, startY);
  ctx.bezierCurveTo(cx1, cy1, cx2, cy2, startX, startY);
  ctx.stroke();

  ctx.lineWidth = 1;
  let midPoint = [
    (cx1 + cx2) / 2 - Math.cos(rad) * 20,
    (cy1 + cy2) / 2 - Math.sin(rad) * 20,
  ];

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(midPoint[0], midPoint[1], 10, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();

  ctx.font = "15px Arial";
  ctx.fillStyle = "black";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(edge.weight.toString(), midPoint[0], midPoint[1]);
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
  let rad = Math.atan2(fromY - toY, fromX - toX);
  let startX = circleR * Math.cos(rad) + fromX;
  let startY = circleR * Math.sin(rad) + fromY;
  let endX = (circleR + 15) * Math.cos(rad) + toX;
  let endY = (circleR + 15) * Math.sin(rad) + toY;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.lineWidth = 3;
  ctx.stroke();
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
  let midX = (fromX + toX) / 2;
  let midY = (fromY + toY) / 2;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.lineWidth = 3;
  ctx.stroke();

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
  ctx.fillText(edge.weight.toString(), midX, midY);
}
