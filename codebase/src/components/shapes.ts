import type { GEdge, GNode } from "@/graph/types";

type GraphObject = {
	data: GEdge | GNode,
	isIntersecting: (data: GEdge | GNode, mouseX: number, mouseY: number) => boolean,
};

// Implement a shape that has two parts draw and is intersecting
// Each object on the graph has its data, priority and shape associated with it
//

type Shape = {
	id: string,
	draw: (ctx: CanvasRenderingContext2D) => void,
	hitbox: (pointX: number, pointY: number) => boolean,
}

// A circle will need and x position, y position, radius, fill color
// A rectangle will need x and y position, width, height, fill color
//

type CircleDrawer = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	r: number,
	color: string) => void;

type RectangleDrawer = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	color: string) => void;

function drawCircle(ctx: CanvasRenderingContext2D) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.stroke();
}

function drawRectangle(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
}




