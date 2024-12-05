import type { GNode, GEdge } from "@/graph/types";
import { STATUS_TO_COLOR } from "../graph/types";

// TODO: Add selection of edges using a rectangle hitbox slightly bigger than the edge

// An edge should be a shape that has a draw of a line, circle and potentially a triangle, and has a hitbox of a rectangle
//
//

export type GraphType = "node" | "edge";

export type GraphItem = {
  id: string;
  type: GraphType;
  shape: Shape;
};

export type Shape = {
  id: string;
  draw: (ctx: CanvasRenderingContext2D) => void;
  hitBox: (x: number, y: number) => boolean;
};

export type CircleOptions = {
  x: number;
  y: number;
  radius: number;
  label: number;
  color: string;
};

export const drawCircle =
  (option: CircleOptions) => (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(option.x, option.y, option.radius, 0, 2 * Math.PI);
    ctx.fillStyle = option.color;
    ctx.fill();
    ctx.stroke();
    ctx.font = "25px Arial";
    ctx.fillStyle = "black";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(option.label.toString(), option.x, option.y);
  };

export const hitBoxCircle =
  (option: CircleOptions) => (x: number, y: number) => {
    if ((x - option.x) ** 2 + (y - option.y) ** 2 <= option.radius ** 2) {
      return true;
    }
    return false;
  };

const testCircle: Shape = {
  id: "Circle1",
  draw: drawCircle({ x: 10, y: 20, radius: 30, label: 1, color: "red" }),
  hitBox: hitBoxCircle({ x: 10, y: 20, radius: 30, label: 1, color: "red" }),
};

//x1 y1 is top left corner
//x2 y2 is bottom right corner
// Need to change this to 4 points
type RectangleOptions = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
};

type LineOptions = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  color: string;
};
// TODO: Add default values for width and nodeRadius
export type EdgeOptions = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  nodeRadius: number;
  isDirected: boolean;
  color: string;
  weight: number;
  width: number;
};

//default width should be 3
export const drawEdge =
  (options: EdgeOptions) => (ctx: CanvasRenderingContext2D) => {
    const {
      fromX,
      fromY,
      toX,
      toY,
      nodeRadius,
      isDirected,
      color,
      weight,
      width,
    } = options;
    if (fromX == toX && fromY == toY) {
      let rad = Math.PI;
      rad = -rad;
      const startX = (nodeRadius - 10) * Math.cos(rad) + fromX;
      const startY = (nodeRadius - 10) * Math.sin(rad) + fromY;

      const SF = 70;

      const cx1 = startX + SF * Math.cos(rad) + SF * Math.sin(rad);
      const cy1 = startY + SF * Math.sin(rad) + SF * Math.cos(rad);

      const cx2 = startX + SF * Math.cos(rad) - SF * Math.sin(rad);
      const cy2 = startY + SF * Math.sin(rad) - SF * Math.cos(rad);

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(cx1, cy1, cx2, cy2, startX, startY);
      ctx.stroke();
      ctx.strokeStyle = "black";

      ctx.lineWidth = 1;
      const midPoint = [
        (cx1 + cx2) / 2 - Math.cos(rad) * 20,
        (cy1 + cy2) / 2 - Math.sin(rad) * 20,
      ];

      addEdgeWeight(ctx, midPoint[0], midPoint[1], weight);
      return;
    }
    if (isDirected) {
      const rad = Math.atan2(fromY - toY, fromX - toX);
      const startX = nodeRadius * Math.cos(rad) + fromX;
      const startY = nodeRadius * Math.sin(rad) + fromY;
      const endX = nodeRadius * Math.cos(rad) + toX;
      const endY = nodeRadius * Math.sin(rad) + toY;

      const triEndX = (nodeRadius + 15) * Math.cos(rad) + toX;
      const triEndY = (nodeRadius + 15) * Math.sin(rad) + toY;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.strokeStyle = color;
      ctx.lineTo(endX, endY);
      ctx.lineWidth = width;
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

      addEdgeWeight(ctx, (fromX + toX) / 2, (fromY + toY) / 2, weight);
      return;
    } else {
      const midX = (fromX + toX) / 2;
      const midY = (fromY + toY) / 2;
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.strokeStyle = "black";
      addEdgeWeight(ctx, midX, midY, weight);
    }
  };

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

export const edgeHitbox = (options: EdgeOptions) => (x: number, y: number) => {
  const {
    fromX,
    fromY,
    toX,
    toY,
    nodeRadius,
    isDirected,
    color,
    weight,
    width,
  } = options;
  const rad = Math.atan2(fromY - toY, fromX - toX);
  const distFromEdge = 15;

  const x1 = distFromEdge * Math.cos(rad + Math.PI / 2) + fromX;
  const y1 = distFromEdge * Math.sin(rad + Math.PI / 2) + fromY;
  const x2 = distFromEdge * Math.cos(rad + (3 * Math.PI) / 2) + fromX;
  const y2 = distFromEdge * Math.sin(rad + (3 * Math.PI) / 2) + fromY;
  const x3 = distFromEdge * Math.cos(rad + Math.PI / 2) + toX;
  const y3 = distFromEdge * Math.sin(rad + Math.PI / 2) + toY;
  const x4 = distFromEdge * Math.cos(rad + (3 * Math.PI) / 2) + toX;
  const y4 = distFromEdge * Math.sin(rad + (3 * Math.PI) / 2) + toY;
  // TODO: Implement the bounding box algorithm
  const rectArea = 30 + Math.sqrt((fromX - toX) ** 2 + (fromY - toY) ** 2);
  const APD = calcArea(x1, y1, x, y, x4, y4);
  const DPC = calcArea(x4, y4, x, y, x3, y3);
  const CBP = calcArea(x3, y3, x2, y2, x, y);
  const PBA = calcArea(x, y, x2, y2, x1, y1);
  const sum = APD + DPC + CBP + PBA;
  if (sum > rectArea) {
    return false;
  } else {
    return true;
  }
};

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
