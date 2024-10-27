import type { GEdge, Gnode } from "../graph/types";
export function drawEdges(nodes: Gnode[], edges: GEdge[]) {
	const canvas: HTMLCanvasElement = document.getElementById("GraphArea") as HTMLCanvasElement;
	const ctx = canvas.getContext("2d");
	// Maybe optimize this using adjacency list later
	if (ctx) {
		for (let i = 0; i < edges.length; i++) {
			let to: string = edges[i].to;
			let from: string = edges[i].from;
			let toCords: number[] = [];
			let fromCords: number[] = [];
			for (let x = 0; x < nodes.length; x++) {
				let cur = nodes[x];
				if (cur.id == to) {
					toCords = [cur.x, cur.y];
				}
				else if (cur.id == from) {
					fromCords = [cur.x, cur.y];
				}
			}
			if (toCords.length == 0 || fromCords.length == 0) {
				alert("One of these nodes does not exist");
				return;
			}
			let midPoint = [(fromCords[0] + toCords[0]) / 2, (fromCords[1] + toCords[1]) / 2];

			ctx.beginPath();
			ctx.moveTo(fromCords[0], fromCords[1]);
			ctx.lineTo(toCords[0], toCords[1]);
			ctx.lineWidth = 5;
			ctx.stroke();

			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.arc(midPoint[0], midPoint[1], 15, 0, 2 * Math.PI);
			ctx.fillStyle = "white";
			ctx.fill();
			ctx.stroke();

			ctx.font = "25px Arial";
			ctx.fillStyle = "black";
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			ctx.fillText(edges[i].weight.toString(), midPoint[0], midPoint[1]);
		}
	}

}
