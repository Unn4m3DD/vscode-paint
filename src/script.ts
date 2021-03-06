
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
  }, () => { tool.name = "bucket"; }),
];

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

function render_preview() {
  ctx.save();

  if (tool.name === "eye_dropper" && mouse.down) {
    let color = drawing_ctx.getImageData(mouse.x - 20, mouse.y, 1, 1).data;
    tool.fill_color = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
    tool.stroke_color = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
  }
  if (tool.name === "marquee" && mouse.down && tool.end_pos === null) {
    ctx.fillStyle = "#000";
    if (tool.start_pos !== null) {
      ctx.setLineDash([4]);
      ctx.strokeRect(
        tool.start_pos.x, tool.start_pos.y,
        mouse.x - 20 - tool.start_pos.x, mouse.y - tool.start_pos.y
      );
      ctx.setLineDash([]);
    } else {
      tool.start_pos = { x: mouse.x - 20, y: mouse.y };
    }
  }
  if (tool.name === "marquee" && !mouse.down && tool.start_pos !== null && tool.end_pos === null) {
    tool.end_pos = { x: mouse.x - 20, y: mouse.y };
    tool.buffered_image =
      drawing_ctx.getImageData(tool.start_pos.x, tool.start_pos.y,
        tool.end_pos.x - tool.start_pos.x, tool.end_pos.y - tool.start_pos.y);
    ctx.putImageData(tool.buffered_image, tool.start_pos.x, tool.start_pos.y);

    drawing_ctx.fillStyle = "#fff";
    drawing_ctx.fillRect(tool.start_pos.x, tool.start_pos.y,
      tool.end_pos.x - tool.start_pos.x, tool.end_pos.y - tool.start_pos.y);
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
      ctx.lineWidth = tool.stroke_size - 15;
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
    drawing_ctx.lineWidth = tool.stroke_size - 15;
    drawing_ctx.beginPath();
    drawing_ctx.moveTo(tool.start_pos.x - 20, tool.start_pos.y);
    drawing_ctx.lineTo(mouse.x - 20, mouse.y);
    drawing_ctx.closePath();
    drawing_ctx.stroke();
    tool.start_pos = null;
  }

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

  if (tool.name === "bucket" && mouse.down) {
    start();
    let target_color = tool.fill_color.replace("rgba(", "").replace(")", "").split(",").map((e) => Number(e));
    target_color[3] = 255;
    floodFill(mouse.x, mouse.y, target_color);

    function getPixel(image_data: ImageData, x: number, y: number) {
      if (x < 0 || y < 0 || x >= image_data.width || y >= image_data.height) {
        return [-1, -1, -1, -1];  // impossible color
      } else {
        const offset = (y * image_data.width + x) * 4;
        return image_data.data.slice(offset, offset + 4);
      }
    }

    function setPixel(image_data: ImageData, x: number, y: number, color: number[]) {
      const offset = (y * image_data.width + x) * 4;
      image_data.data[offset + 0] = color[0];
      image_data.data[offset + 1] = color[1];
      image_data.data[offset + 2] = color[2];
      image_data.data[offset + 3] = color[0];
    }

    function colorsMatch(a: number[] | Uint8ClampedArray, b: number[] | Uint8ClampedArray) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    }

    function floodFill(x: number, y: number, fillColor: number[]) {
      // read the pixels in the canvas
      const image_data = drawing_ctx.getImageData(0, 0, drawing_ctx.canvas.width, drawing_ctx.canvas.height);

      // get the color we're filling
      const targetColor = getPixel(image_data, x, y);

      // check we are actually filling a different color
      if (!colorsMatch(targetColor, fillColor)) {

        const pixelsToCheck = [x, y];
        while (pixelsToCheck.length > 0) {
          const y = pixelsToCheck.pop()!!;
          const x = pixelsToCheck.pop()!!;

          const currentColor = getPixel(image_data, x, y);
          if (colorsMatch(currentColor, targetColor)) {
            setPixel(image_data, x, y, fillColor);
            pixelsToCheck.push(x + 1, y);
            pixelsToCheck.push(x - 1, y);
            pixelsToCheck.push(x, y + 1);
            pixelsToCheck.push(x, y - 1);
          }
        }

        // put the data back
        drawing_ctx.putImageData(image_data, 0, 0);
      }
    }


    end();
  }

  ctx.restore();
}
var startTime: any, endTime: any;

function start() {
  startTime = new Date();
};

function end() {
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds 
  var seconds = Math.round(timeDiff);
  console.log(seconds + " seconds");
}
function render_marquee() {
  let mouse_inside_marquee = () => {
    if (tool.start_pos === null || tool.end_pos === null)
      return false;
    return Math.abs(tool.start_pos.x - mouse.x + 20) + Math.abs(tool.end_pos.x - mouse.x + 20)
      === Math.abs(tool.start_pos.x - tool.end_pos.x) &&
      Math.abs(tool.start_pos.y - mouse.y) + Math.abs(tool.end_pos.y - mouse.y)
      === Math.abs(tool.start_pos.y - tool.end_pos.y);
  };
  if (tool.name === "marquee" && tool.start_pos !== null && tool.end_pos !== null) {
    // ctx.putImageData(tool.buffered_image, tool.start_pos.x, tool.start_pos.y);
    if (mouse.down)
      if (mouse_inside_marquee())
        if (mouse.update) {
          let diff_x = (mouse.old_x - mouse.x);
          let diff_y = (mouse.old_y - mouse.y);
          tool.start_pos.x -= diff_x;
          tool.start_pos.y -= diff_y;
          tool.end_pos.x -= diff_x;
          tool.end_pos.y -= diff_y;
        } else { }
      else {
        drawing_ctx.putImageData(tool.buffered_image!!, tool.start_pos.x, tool.start_pos.y);
        tool.start_pos = null;
        tool.end_pos = null;
        mouse.down = false;
        return;
      }
    ctx.putImageData(tool.buffered_image!!, tool.start_pos.x, tool.start_pos.y);
    ctx.setLineDash([4]);
    ctx.strokeRect(
      tool.start_pos.x, tool.start_pos.y,
      tool.end_pos.x - tool.start_pos.x, tool.end_pos.y - tool.start_pos.y
    );
    ctx.setLineDash([]);
  }
};

let color_picker = new ColorPicker();
const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#666";
  ctx.fillRect(0, 0, 160, canvas.height);
  translate(5, 50);
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
  translate(-5, -50);


  translate(20, 350);
  brush_size_slider.render();
  translate(-20, -350);
  translate(20, 400);
  color_picker.render();
  translate(-20, -400);
  translate(20, 500);
  color_slider.render();
  translate(-20, -500);

  render_marquee();

  if (mouse.x > 160)
    render_preview();
  mouse.update = false;
};

const timeout = setInterval(render, Math.round(1000 / 120));
