/* eslint-disable @typescript-eslint/naming-convention */
class Button {
  inner_render: () => void;
  constructor(inner_render: () => void) {
    this.inner_render = inner_render;
  }
  mouse_inside_bound() {
    const top_left = get_global_position({ x: -25, y: -25 });
    const bottom_right = get_global_position({ x: 25, y: 25 });
    return (top_left.x < mouse.x && mouse.x < bottom_right.x &&
      top_left.y < mouse.y && mouse.y < bottom_right.y);
  }
  render() {
    if (this.mouse_inside_bound()) {
      if (mouse.down)
        ctx.fillStyle = "#111";
      else
        ctx.fillStyle = "#444";
    }
    else
      ctx.fillStyle = "#777";
    ctx.fillRect(-25, -25, 50, 50);
    this.inner_render();
  }
}