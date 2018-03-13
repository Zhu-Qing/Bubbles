import Map from './object/map.js'
import Bubble from './object/bubble.js'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor(ctx) {
    if (instance)
      return instance

    instance = this
    
    this.ctx = ctx
    this.actions = []
    this.select

    this.map = new Map()

    this.bubble = new Array();
    for (var i = 0; i < 9; i++) {
      this.bubble[i] = new Array(i);
      for (var j = 0; j < 9; j++) {
        this.bubble[i][j] = new Bubble(i, j);
      }
    }

    this.isMoving = false
  }

  reset() {

  }

  /**通过画布坐标获取bubble */
  getBubble(px, py) {
    //console.log(px,py)

    if (px < this.map.startX || py < this.map.startY || px >= (this.map.startX + this.map.mapWidth) || py >= (this.map.startY + this.map.mapWidth)){
      return null
    }

    console.log(parseInt((px - this.map.startX) / this.map.cellWidth), parseInt((py - this.map.startY) / this.map.cellWidth))
    let x = parseInt((px - this.map.startX) / this.map.cellWidth)
    let y = parseInt((py - this.map.startY) / this.map.cellWidth)

    return this.bubble[x][y]
  }

  getEmptyBubble() {
    //console.log(px,py)
    var empties = []

    for (var i = 0; i < this.bubble.length; i++) {
      for (var j = 0; j < this.bubble[i].length; j++) {
        if (!this.bubble[i][j].color)
          empties.push(this.bubble[i][j])
      }
    }

    return empties
  }
}
