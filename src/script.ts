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
  }, () => { tool.name = "rectangle"; }),
  new Button(() => {
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
  }, () => { tool.name = "elipse"; }),
  new Button(() => {
    ctx.fillStyle = "#000";
    ctx.fillRect(-12.5, -6.5, 25, 13);
  }, () => { tool.name = "fill_rectangle"; }),
  new Button(() => {
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }, () => { tool.name = "fill_elipse"; }),
  new Button(() => {
    ctx.drawImage(brush, 0, 0, brush.width, brush.height, -16, -16, 35, 35);
  }, () => { tool.name = "brush"; }),
  new Button(() => {
    ctx.drawImage(eye_dropper, 0, 0, eye_dropper.width, eye_dropper.height, -16, -16, 35, 35);
  }, () => { tool.name = "eye_dropper"; }),
  new Button(() => {
    ctx.beginPath();
    ctx.moveTo(-10, -12);
    ctx.lineTo(10, 12);
    ctx.closePath();
    ctx.stroke();
  }, () => { tool.name = "line"; }),
  new Button(() => {
    ctx.drawImage(bucket, 0, 0, bucket.width, bucket.height, -16, -16, 35, 35);
  }, () => { }),
];

const render_preview = () => {
  ctx.save();
  ctx.fillStyle = tool.stroke_color;
  ctx.strokeStyle = tool.stroke_color;
  if (tool.name === "eraser") {
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#FFF";
  }
  if (tool.name === "brush" || tool.name === "eraser") {
    ctx.beginPath();
    ctx.arc(mouse.x - 20, mouse.y, tool.stroke_size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
};

let brush_size_slider = new Slider(() => {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 120, 4);
  ctx.fillStyle = tool.fill_color;
  if (euclidean_distance(mouse, get_global_position({ x: brush_size_slider.current_x, y: 0 })) < 5 + tool.stroke_size / 2) {
    if (mouse.down)
      brush_size_slider.selected = true;
    ctx.fillStyle = "#f00";
  }
  if (brush_size_slider.selected && mouse.update)
    brush_size_slider.current_x += (mouse.x - mouse.old_x);
  if (brush_size_slider.current_x > 120) brush_size_slider.current_x = 120;
  if (brush_size_slider.current_x < 0) brush_size_slider.current_x = 0;
  ctx.beginPath();
  ctx.arc(brush_size_slider.current_x, 2, tool.stroke_size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  tool.stroke_size = brush_size_slider.current_x / 3 + 10;
  if (!mouse.down)
    brush_size_slider.selected = false;
});

let color_slider = new Slider(() => {
  let old_stroke = ctx.strokeStyle;
  let gradient = ctx.createLinearGradient(0, 0, 120, 0);
  gradient.addColorStop(0, 'red');
  gradient.addColorStop(1 / 6, 'orange');
  gradient.addColorStop(2 / 6, 'yellow');
  gradient.addColorStop(3 / 6, 'green');
  gradient.addColorStop(4 / 6, 'blue');
  gradient.addColorStop(5 / 6, 'indigo');
  gradient.addColorStop(1, 'violet');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 120, 4);
  if (euclidean_distance(mouse, get_global_position({ x: color_slider.current_x, y: 0 })) < 5 + tool.stroke_size / 2) {
    if (mouse.down)
      color_slider.selected = true;
  }

  let { x, y } = get_global_position({ x: color_slider.current_x - 14, y: 2 });
  let color = ctx.getImageData(Math.round(x * .95), y, 1, 1).data;
  tool.base_color = Array.from(color).map(e => e / 255);
  ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;

  if (color_slider.selected && mouse.update)
    color_slider.current_x += (mouse.x - mouse.old_x);
  if (color_slider.current_x > 120) color_slider.current_x = 120;
  if (color_slider.current_x < 0) color_slider.current_x = 0;
  ctx.beginPath();
  ctx.arc(color_slider.current_x, 2, 7, 0, Math.PI * 2);
  ctx.closePath();
  ctx.stroke();

  if (!mouse.down)
    color_slider.selected = false;
  ctx.strokeStyle = old_stroke;
});

function tools() {
  let old_stroke = ctx.strokeStyle;
  let old_stroke_width = ctx.lineWidth;

  if (tool.name === "eye_dropper" && mouse.down) {
    let color = drawing_ctx.getImageData(mouse.x, mouse.y, 1, 1).data;
    tool.fill_color = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
    tool.stroke_color = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
  }
  if (tool.name === "rectangle" && mouse.down) {
    if (tool.start_pos !== null) {
      ctx.strokeStyle = tool.fill_color;
      ctx.lineWidth = tool.stroke_size - 15;
      ctx.strokeRect(
        tool.start_pos.x - 20, tool.start_pos.y,
        mouse.x - tool.start_pos.x, mouse.y - tool.start_pos.y
      );
    } else {
      tool.start_pos = { x: mouse.x, y: mouse.y };
    }
  }
  if (tool.name === "rectangle" && !mouse.down && tool.start_pos !== null) {
    drawing_ctx.strokeStyle = tool.fill_color;
    drawing_ctx.lineWidth = tool.stroke_size - 15;
    drawing_ctx.strokeRect(
      tool.start_pos!!.x - 20, tool.start_pos!!.y,
      mouse.x - tool.start_pos!!.x, mouse.y - tool.start_pos!!.y
    );
    tool.start_pos = null;
  }
  if (tool.name === "fill_rectangle" && mouse.down) {
    if (tool.start_pos !== null) {
      ctx.fillStyle = tool.fill_color;
      ctx.fillRect(
        tool.start_pos.x - 20, tool.start_pos.y,
        mouse.x - tool.start_pos.x, mouse.y - tool.start_pos.y
      );
    } else {
      tool.start_pos = { x: mouse.x, y: mouse.y };
    }
  }
  if (tool.name === "fill_rectangle" && !mouse.down && tool.start_pos !== null) {
    drawing_ctx.fillStyle = tool.fill_color;
    drawing_ctx.fillRect(
      tool.start_pos!!.x - 20, tool.start_pos!!.y,
      mouse.x - tool.start_pos!!.x, mouse.y - tool.start_pos!!.y
    );
    tool.start_pos = null;
  }


  if (tool.name === "elipse" && mouse.down) {
    if (tool.start_pos !== null) {
      ctx.strokeStyle = tool.fill_color;
      ctx.lineWidth = tool.stroke_size - 15;
      ctx.beginPath();
      ctx.ellipse(
        tool.start_pos.x + (mouse.x - 20 - tool.start_pos.x) / 2,
        tool.start_pos.y + (mouse.y - tool.start_pos.y) / 2,
        Math.abs(mouse.x - tool.start_pos.x) / 2, Math.abs(mouse.y - tool.start_pos.y) / 2,
        0, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();
    } else {
      tool.start_pos = { x: mouse.x, y: mouse.y };
    }
  }
  if (tool.name === "elipse" && !mouse.down && tool.start_pos !== null) {
    drawing_ctx.strokeStyle = tool.fill_color;
    drawing_ctx.lineWidth = tool.stroke_size - 15;
    drawing_ctx.beginPath();
    drawing_ctx.ellipse(
      tool.start_pos.x + (mouse.x - 20 - tool.start_pos.x) / 2,
      tool.start_pos.y + (mouse.y - tool.start_pos.y) / 2,
      Math.abs(mouse.x - tool.start_pos.x) / 2, Math.abs(mouse.y - tool.start_pos.y) / 2,
      0, 0, 2 * Math.PI);
    drawing_ctx.closePath();
    drawing_ctx.stroke();
    tool.start_pos = null;
  }
  if (tool.name === "fill_elipse" && mouse.down) {
    if (tool.start_pos !== null) {
      ctx.fillStyle = tool.fill_color;
      ctx.beginPath();
      ctx.ellipse(
        tool.start_pos.x + (mouse.x - 20 - tool.start_pos.x) / 2,
        tool.start_pos.y + (mouse.y - tool.start_pos.y) / 2,
        Math.abs(mouse.x - tool.start_pos.x) / 2, Math.abs(mouse.y - tool.start_pos.y) / 2,
        0, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
    } else {
      tool.start_pos = { x: mouse.x, y: mouse.y };
    }
  }
  if (tool.name === "fill_elipse" && !mouse.down && tool.start_pos !== null) {
    drawing_ctx.fillStyle = tool.fill_color;
    drawing_ctx.beginPath();
    drawing_ctx.ellipse(
      tool.start_pos.x + (mouse.x - 20 - tool.start_pos.x) / 2,
      tool.start_pos.y + (mouse.y - tool.start_pos.y) / 2,
      Math.abs(mouse.x - tool.start_pos.x) / 2, Math.abs(mouse.y - tool.start_pos.y) / 2,
      0, 0, 2 * Math.PI);
    drawing_ctx.closePath();
    drawing_ctx.fill();
    tool.start_pos = null;
  }


  if (tool.name === "line" && mouse.down) {
    if (tool.start_pos !== null) {
      ctx.strokeStyle = tool.fill_color;
      ctx.beginPath();
      ctx.moveTo(tool.start_pos.x - 20, tool.start_pos.y);
      ctx.lineTo(mouse.x - 20, mouse.y);
      ctx.closePath();
      ctx.stroke();
    } else {
      tool.start_pos = { x: mouse.x, y: mouse.y };
    }
  }
  if (tool.name === "line" && !mouse.down && tool.start_pos !== null) {
    drawing_ctx.strokeStyle = tool.fill_color;
    drawing_ctx.beginPath();
    drawing_ctx.moveTo(tool.start_pos.x - 20, tool.start_pos.y);
    drawing_ctx.lineTo(mouse.x - 20, mouse.y);
    drawing_ctx.closePath();
    drawing_ctx.stroke();
    tool.start_pos = null;
  }

  ctx.lineWidth = old_stroke_width;
  ctx.strokeStyle = old_stroke;
}

let color_picker = new ColorPicker();
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
  tools();
  translate(40, 350);
  brush_size_slider.render();
  translate(-40, -350);
  translate(40, 400);
  color_picker.render();
  translate(-40, -400);
  translate(40, 500);
  color_slider.render();
  translate(-40, -500);


  render_preview();
  mouse.update = false;
};

const timeout = setInterval(render, Math.round(1000 / 120));
