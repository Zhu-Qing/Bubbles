import Map from '../object/map.js'

let map = new Map()

export default class Bubble{
  constructor(x,y){
    this.x = x
    this.y = y
    this.isEmpty = true
    this.color = null
    this.light = 10 
    this.px = map.startX + (1 + 2 * this.x) * map.cellWidth / 2
    this.py = map.startY + (1 + 2 * this.y) * map.cellWidth / 2

  }

  addBubble(color){
    this.empty = false
    this.color = color
  }

  delBubble() {
    this.empty = true
    this.color = null
  }

  /**绘制泡泡 */
  draw(ctx) {
    ctx.beginPath();
    var gradient = ctx.createRadialGradient(this.px + 5, this.py - 5, 0, this.px, this.py, this.light);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, this.color);
    ctx.fillStyle = gradient;
    ctx.arc(this.px, this.py, map.cellWidth / 2 - 3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }

}