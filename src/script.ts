/* eslint-disable @typescript-eslint/naming-convention */
ctx.fillStyle = "#000";
ctx.strokeStyle = "#000";

let buttons = [
  new Button(() => {
    ctx.setLineDash([4]);
    ctx.strokeRect(-12.5, -6.5, 25, 13);
    ctx.setLineDash([]);
  }, () => { tool.name = "marquee"; }),
  new Button(() => {
    ctx.drawImage(eraser, 0, 0, eraser.width, eraser.height, -18, -13, 35, 35);
  }, () => { tool.name = "eraser"; }),
  new Button(() => {
    ctx.strokeRect(-12.5, -6.5, 25, 13);
  }, () => { }),
  new Button(() => {
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
  }, () => { }),
  new Button(() => {
    ctx.drawImage(brush, 0, 0, brush.width, brush.height, -16, -16, 35, 35);
  }, () => { tool.name = "brush"; }),
  new Button(() => {
    ctx.drawImage(eye_dropper, 0, 0, eye_dropper.width, eye_dropper.height, -16, -16, 35, 35);
  }, () => { }),
  new Button(() => {
    ctx.drawImage(text_icon, 0, 0, text_icon.width, text_icon.height, -16, -16, 35, 35);
  }, () => { }),
  new Button(() => {
    ctx.beginPath();
    ctx.moveTo(-10, -12);
    ctx.lineTo(10, 12);
    ctx.closePath();
    ctx.stroke();
  }, () => { }),
  new Button(() => {
    ctx.drawImage(bucket, 0, 0, bucket.width, bucket.height, -16, -16, 35, 35);
  }, () => { }),
];
const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  translate(20, 50);
  for (let i = 0; i < buttons.length / 2; i++) {
    translate(50, 50 * i);
    buttons[2 * i].render();
    translate(-50, -50 * i);
    if (buttons[2 * i + 1]) {
      translate(50 + 50, 50 * i);
      buttons[2 * i + 1].render();
      translate(-50 - 50, -50 * i);
    }
  }
  translate(-20, -50);
  ctx.save();
  ctx.fillStyle = tool.stroke_color;
  ctx.strokeStyle = tool.stroke_color;
  if (tool.name === "eraser") {
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#FFF";
  }
  if (tool.name === "brush" || tool.name === "eraser") {
    ctx.beginPath();
    ctx.arc(mouse.x - 20, mouse.y, 6.5, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
};

const timeout = setInterval(render, Math.round(1000 / 120));
