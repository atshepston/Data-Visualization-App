import type { GNode } from "../graph/types";
import { STATUS_TO_COLOR } from "../graph/types";

export type DrawNodeOptions = {
  nodeRadius: number;
  ctx: CanvasRenderingContext2D;
}

/**
 * draws the nodes of a graph to the canvas
 *
 * @param nodes - nodes we want to draw
 * @param drawOptions - options including ctx and nodeRadius
 * @example drawNodes(nodes, { nodeRadius: 10, ctx });
 */
export function drawNodes(nodes: GNode[], drawOptions: DrawNodeOptions) {
  nodes.forEach((node) => drawNode(node, drawOptions));
}

function drawNode(node: GNode, { nodeRadius, ctx }: DrawNodeOptions) {
  const { x, y, status, id } = node;
  let color = STATUS_TO_COLOR[status];
  ctx.beginPath();
  ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
  ctx.font = "25px Arial";
  ctx.fillStyle = "black";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(id.toString(), x, y);
}
