const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const CELL_COUNT = 9
const LINE_COUNT = 5
const MARGIN = 5
const LIGHT = 12

let instance

export default class Map {
  constructor(ctx){
    if (instance)
      return instance

    this.startX = MARGIN
    this.startY = (screenHeight/2 - screenWidth/2)
    this.mapWidth = (screenWidth - 2 * this.startX)
    this.cellCount = CELL_COUNT
    this.cellWidth = (screenWidth - 2 * this.startX) / this.cellCount
  }

  /**绘制棋盘 */
  draw(ctx) {
    //填充屏幕为白色
    ctx.beginPath()
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    ctx.lineWidth = 2;
    //设置线条颜色，必填
    ctx.strokeStyle = 'rgba(0,0,0,1)'
    for (var i = 0; i <= this.cellCount; i++) {
      //先画竖线
      var p1 = i * this.cellWidth + this.startX;
      ctx.moveTo(p1, this.startY);
      ctx.lineTo(p1, this.startY + this.mapWidth);

      //再画横线
      var p2 = i * this.cellWidth + this.startY;
      ctx.moveTo(this.startX, p2);
      ctx.lineTo(this.mapWidth + this.startX, p2);
    }
    ctx.stroke()
  }
}