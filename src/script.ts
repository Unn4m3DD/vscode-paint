/* eslint-disable @typescript-eslint/naming-convention */
ctx.fillStyle = "#000";
ctx.strokeStyle = "#000";

let buttons = [
  new Button(() => {
    ctx.setLineDash([4]);
    ctx.strokeRect(-12.5, -6.5, 25, 13);
    ctx.setLineDash([]);
  }),
  new Button(() => {
    ctx.drawImage(eraser, 0, 0, eraser.width, eraser.height, -18, -13, 35, 35);
  }),
  new Button(() => {
    ctx.strokeRect(-12.5, -6.5, 25, 13);
  }),
  new Button(() => {
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
  }),
  new Button(() => {
    ctx.drawImage(brush, 0, 0, brush.width, brush.height, -16, -16, 35, 35);
  }),
  new Button(() => {
    ctx.drawImage(eye_dropper, 0, 0, eye_dropper.width, eye_dropper.height, -16, -16, 35, 35);
  }),
  new Button(() => {
    ctx.drawImage(text_icon, 0, 0, text_icon.width, text_icon.height, -16, -16, 35, 35);
  }),
  new Button(() => {
    ctx.beginPath();
    ctx.moveTo(-10, -12);
    ctx.lineTo(10, 12);
    ctx.closePath();
    ctx.stroke();
  }),
  new Button(() => {
    ctx.drawImage(bucket, 0, 0, bucket.width, bucket.height, -16, -16, 35, 35);
  }),
];
const render = () => {
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
};

const timeout = setInterval(render, Math.round(1000 / 30));
