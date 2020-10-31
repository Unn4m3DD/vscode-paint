/* eslint-disable @typescript-eslint/naming-convention */
declare var res_path: string;
let translation: { x: number, y: number } = { x: 20, y: 0 };
function translate(x: number, y: number) {
  translation = {
    x: translation.x + x,
    y: translation.y + y
  };
  ctx.translate(x, y);
}

function get_global_position({ x, y }: { x: number, y: number }): { x: number, y: number } {
  return { x: translation.x + x, y: translation.y + y };
}

let mouse: Mouse = { x: 0, y: 0, down: false };

const mouse_move = (event: MouseEvent) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
};
const mouse_down = () => {
  mouse.down = true;
};
const mouse_up = () => {
  mouse.down = false;
};

const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas!!.onmousemove = mouse_move;
canvas!!.onmousedown = mouse_down;
canvas!!.onmouseup = mouse_up;
const ctx = canvas.getContext("2d")!!;

ctx.fillStyle = "#FFF";
ctx.fillRect(0, 0, canvas.width, canvas.height);
let eraser = new Image(981, 929);
eraser.src = "https://icon-library.com/images/eraser-icon/eraser-icon-0.jpg";

let eye_dropper = new Image(200, 200);
eye_dropper.src = "https://static.thenounproject.com/png/601137-200.png";

let brush = new Image(512, 512);
brush.src = "https://image.flaticon.com/icons/png/512/45/45135.png";

let text_icon = new Image(512, 512);
text_icon.src = "https://cdn.iconscout.com/icon/free/png-512/a-character-alphabet-letter-32849.png";

let bucket = new Image(952, 980);
bucket.src = "https://cdn.onlinewebfonts.com/svg/img_470306.png";


