
export type Gnode = {
	id: string;
	x: number;
	y: number;
	status: Status;
};

export type GEdge = {
	// Representation of graph edge
	id: string;
	to: string;
	from: string;
	weight: number;
	type: "directed" | "undirected";
};
export type AdjacencyList = Record<number, number[]>;

export enum Status {
	default = "green",
	selected = "red"
}
