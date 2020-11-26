interface Mouse {
  x: number,
  y: number,
  old_x: number,
  old_y: number,
  down: boolean,
  update: boolean
}
interface Tool {
  name: string,
  fill_color: string,
  stroke_color: string,
  stroke_size: number,
  start_pos: { x: number, y: number } | null,
  base_color: number[]
}