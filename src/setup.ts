/* eslint-disable @typescript-eslint/naming-convention */
declare var res_path: string;
let tool: Tool = {
  name: "none",
  fill_color: "rgba(0, 0, 0, 1)",
  stroke_color: "rgba(0, 0, 0, 1)",
  stroke_size: 10,
  start_pos: null,
  end_pos: null,
  buffered_image: null,
  base_color: [1, 0, 0, 1]
};
let translation: { x: number, y: number } = { x: 20, y: 0 };
function translate(x: number, y: number) {
  translation = {
    x: translation.x + x,
    y: translation.y + y
  };
  ctx.translate(x, y);
}

function array_to_rgba(arr: number[]) {
  let ret = arr.map(function (v) {
    return Math.max(Math.min(Math.round(v * 255), 255), 0);
  });
  ret[3] = arr[3];
  return 'rgba(' + ret.join(',') + ')';
}

function get_global_position({ x, y }: { x: number, y: number }): { x: number, y: number } {
  return { x: translation.x + x, y: translation.y + y };
}

function euclidean_distance(a: { x: number, y: number }, b: { x: number, y: number }) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

let mouse: Mouse = { x: 0, y: 0, old_x: 0, old_y: 0, down: false, update: false };

const mouse_move = (event: MouseEvent) => {
  drawing_ctx.save();
  drawing_ctx.fillStyle = tool.stroke_color;
  drawing_ctx.strokeStyle = tool.stroke_color;
  if (tool.name === "eraser") {
    drawing_ctx.fillStyle = "#FFF";
    drawing_ctx.strokeStyle = "#FFF";
  }
  if ((tool.name === "brush" || tool.name === "eraser") && mouse.down) {
    drawing_ctx.beginPath();
    drawing_ctx.lineWidth = tool.stroke_size;
    drawing_ctx.moveTo(mouse.x - 20, mouse.y);
    drawing_ctx.lineTo(event.clientX - 20, event.clientY);
    drawing_ctx.closePath();
    drawing_ctx.stroke();

    drawing_ctx.beginPath();
    drawing_ctx.arc(mouse.x - 20, mouse.y, tool.stroke_size / 2, 0, Math.PI * 2);
    drawing_ctx.closePath();
    drawing_ctx.fill();
  }
  drawing_ctx.restore();
  mouse.update = true;
  mouse.old_x = mouse.x;
  mouse.old_y = mouse.y;
  mouse.x = event.clientX;
  mouse.y = event.clientY;
};
const mouse_down = () => {
  mouse.down = true;
};
const mouse_up = () => {
  mouse.down = false;
};

const drawing_canvas = <HTMLCanvasElement>document.getElementById("drawing_canvas");
const drawing_ctx = drawing_canvas.getContext("2d")!!;
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas!!.onmousemove = mouse_move;
canvas!!.onmousedown = mouse_down;
canvas!!.onmouseup = mouse_up;
const ctx = canvas.getContext("2d")!!;
drawing_ctx.fillStyle = "#FFF";
drawing_ctx.fillRect(0, 0, canvas.width, canvas.height);
let eraser = new Image(981, 929);
eraser.src = "https://raw.githubusercontent.com/Unn4m3DD/vscode-paint/master/res/eraser.jpg";
eraser.crossOrigin = "";
let eye_dropper = new Image(200, 200);
eye_dropper.src = "https://raw.githubusercontent.com/Unn4m3DD/vscode-paint/master/res/eyedropper.png";
eye_dropper.crossOrigin = "";
let brush = new Image(512, 512);
brush.src = "https://raw.githubusercontent.com/Unn4m3DD/vscode-paint/master/res/brush.png";
brush.crossOrigin = "";
let text_icon = new Image(512, 512);
text_icon.src = "https://raw.githubusercontent.com/Unn4m3DD/vscode-paint/master/res/char.png";
text_icon.crossOrigin = "";
let bucket = new Image(952, 980);
bucket.src = "https://raw.githubusercontent.com/Unn4m3DD/vscode-paint/master/res/bucket.png";
bucket.crossOrigin = "";

