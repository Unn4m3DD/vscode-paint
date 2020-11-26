/* eslint-disable @typescript-eslint/naming-convention */
class Button {
  inner_render: () => void;
  onclick: () => void;
  constructor(inner_render: () => void, onclick: () => void) {
    this.inner_render = inner_render;
    this.onclick = onclick;
  }
  mouse_inside_bound() {
    const top_left = get_global_position({ x: -25, y: -25 });
    const bottom_right = get_global_position({ x: 25, y: 25 });
    return (top_left.x < mouse.x && mouse.x < bottom_right.x &&
      top_left.y < mouse.y && mouse.y < bottom_right.y);
  }
  render() {
    if (this.mouse_inside_bound()) {
      if (mouse.down) {
        this.onclick();
        ctx.fillStyle = "#111";
      }
      else
        ctx.fillStyle = "#444";
    }
    else
      ctx.fillStyle = "#777";
    ctx.fillRect(-25, -25, 50, 50);
    this.inner_render();
  }
}

/* eslint-disable @typescript-eslint/naming-convention */
class Slider {
  current_x: number;
  selected: boolean;
  render: () => void;
  constructor(render: () => void) {
    this.current_x = 10;
    this.selected = false;
    this.render = render;
  }
}

class ColorPicker {
  quad_gradient(position_x: number, position_y: number, width: number, height: number,
    corners: {
      topLeft: number[],
      topRight: number[],
      bottomLeft: number[],
      bottomRight: number[]
    }) {
    let gradient, startColor, endColor, fac;
    for (let i = 0; i < height; i++) {
      gradient = ctx.createLinearGradient(0, i, width, i);
      fac = i / (height - 1);

      startColor = array_to_rgba(
        this.lerp(corners.topLeft, corners.bottomLeft, fac)
      );
      endColor = array_to_rgba(
        this.lerp(corners.topRight, corners.bottomRight, fac)
      );

      gradient.addColorStop(0, startColor);
      gradient.addColorStop(1, endColor);

      ctx.fillStyle = gradient;
      ctx.fillRect(position_x, position_y + i, width, 1);
    }
  }


  lerp(a: number[], b: number[], fac: number) {
    return a.map(function (v, i) {
      return v * (1 - fac) + b[i] * fac;
    });
  }
  mouse_inside_bound() {
    const top_left = get_global_position({ x: 0, y: 0 });
    const bottom_right = get_global_position({ x: 120, y: 80 });
    return (top_left.x < mouse.x && mouse.x < bottom_right.x &&
      top_left.y < mouse.y && mouse.y < bottom_right.y);
  }
  render() {
    this.quad_gradient(0, 0, 120, 80, {
      topLeft: [1, 1, 1, 1],
      topRight: tool.base_color,
      bottomLeft: [0, 0, 0, 1],
      bottomRight: [0, 0, 0, 1]
    });

    if (this.mouse_inside_bound()) {
      if (mouse.down) {
        let { x, y } = ({ x: mouse.x - 20, y: mouse.y });
        let color = ctx.getImageData(x, y, 1, 1).data;
        console.log({ x, y, color })
        tool.fill_color = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
        tool.stroke_color = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
      }
    }
  }
}
