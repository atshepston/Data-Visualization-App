import type { GNode, GEdge } from "@/graph/types"
import { STATUS_TO_COLOR } from "../graph/types";

// TODO: Add selection of edges using a rectangle hitbox slightly bigger than the edge

type Shape = {
	id: string,
	draw: (ctx: CanvasRenderingContext2D) => void,
	hitBox: (x: number, y: number) => void,
}

type CircleOptions = {
	x: number,
	y: number,
	radius: number,
	label: number,
	color: string
}


const drawCircle = (option: CircleOptions) => (ctx: CanvasRenderingContext2D) => {
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
}

const hitBoxCircle = (option: CircleOptions) => (x: number, y: number) => {
	if ((x - option.x) ** 2 + (y - option.y) ** 2 <= option.radius ** 2) {
		return true;
	}
	return false;
}

const testCircle: Shape = {
	id: "Circle1",
	draw: drawCircle({ x: 10, y: 20, radius: 30, label: 1, color: "red" }),
	hitBox: hitBoxCircle({ x: 10, y: 20, radius: 30, label: 1, color: "red" })
}


//x1 y1 is top left corner
//x2 y2 is bottom right corner 
type RectangleOptions = {
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	color: string
}

type LineOptions = {
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	width: number,
	color: string
}

const rectangleHitbox = (options: RectangleOptions) => (x: number, y: number) => {
	if (options.x1 <= x && x <= options.x2 && options.y1 >= y && options.y2 <= y) {
		return true;
	}
	return false;
}

const drawLine = (options: LineOptions) => (ctx: CanvasRenderingContext2D) => {
	ctx.beginPath();
	ctx.lineWidth = options.width;
	ctx.strokeStyle = options.color;
	ctx.moveTo(options.x1, options.x2);
	ctx.lineTo(options.x2, options.y2);
	ctx.stroke();

}


