
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx = canvas.getContext("2d");
if (ctx) ctx.fillStyle = "#FF0000";
ctx?.fillRect(0, 0, 100, 100);
