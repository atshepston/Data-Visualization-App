interface Shape {
  draw: (ctx: CanvasRenderingContext2D) => void;
  hitbox: (point: Coordinate) => boolean;
}

interface Coordinate {
  x: number;
  y: number;
}

interface Stroke {
  color: string;
  width: number;
}

interface Circle {
  at: Coordinate;
  radius: number;
  color: string;
  stroke: Stroke;
  text: string;
}

interface Line {
  start: Coordinate;
  end: Coordinate;
  width: number;
  text: string;
  color: string;
}

export const circle = (options: Circle): Shape => { // Circle Function
  const hitbox = (point: Coordinate) => {
    const dx = point.x - options.at.x;
    const dy = point.y - options.at.y;
    return Math.sqrt(dx * dx + dy * dy) <= options.radius;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(options.at.x, options.at.y, options.radius, 0, Math.PI * 2);
    ctx.fillStyle = options.color;
    ctx.fill();
    ctx.lineWidth = options.stroke.width;
    ctx.strokeStyle = options.stroke.color;
    ctx.stroke();
    ctx.fillStyle = "black"; // Text color
    ctx.fillText(options.text, options.at.x, options.at.y);
    ctx.closePath();
  };

  return {
    draw,
    hitbox,
  };
};

export const line = (options: Line): Shape => { // Line Function
  const hitbox = (point: Coordinate) => {
    const distance =
      Math.abs(
        (options.end.y - options.start.y) * point.x -
          (options.end.x - options.start.x) * point.y +
          options.end.x * options.start.y -
          options.end.y * options.start.x
      ) /
      Math.sqrt(
        (options.end.y - options.start.y) ** 2 +
          (options.end.x - options.start.x) ** 2
      );
    return distance <= options.width / 2;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.moveTo(options.start.x, options.start.y);
    ctx.lineTo(options.end.x, options.end.y);
    ctx.lineWidth = options.width;
    ctx.strokeStyle = options.color;
    ctx.stroke();
    ctx.fillStyle = "black";
    const midX = (options.start.x + options.end.x) / 2;
    const midY = (options.start.y + options.end.y) / 2;
    ctx.fillText(options.text, midX, midY);
    ctx.closePath();
  };

  return {
    draw,
    hitbox,
  };
};

export const arrow = (options: Line): Shape => { // Arrow Function
  return line(options);
};
