import type { Gnode } from "../graph/types";
export function drawNodes(ctx: CanvasRenderingContext2D, nodes: Gnode[], r: number) {
	if (ctx) {
		for (let i = 0; i < nodes.length; i++) {
			let x = nodes[i].x;
			let y = nodes[i].y;
			let color = nodes[i].status;
			let id = nodes[i].id;
			ctx.beginPath();
			ctx.arc(x, y, r, 0, 2 * Math.PI);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.stroke();
			ctx.font = "25px Arial";
			ctx.fillStyle = "black";
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			ctx.fillText(id.toString(), x, y);
		}
	}
}
