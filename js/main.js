import Run from './runtime/run.js'
import DataBus from './databus'

let ctx   = canvas.getContext('2d')
let databus = new DataBus()

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.run = new Run()
    this.start()

  }

  start(){
    this.touchHandler = this.touchEventHandler.bind(this)
    canvas.addEventListener('touchstart', this.touchHandler)

    databus.ctx = ctx

    if(false == this.run.ready()){
      this.run.gameOver()
      return
    }
    this.run.draw()

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )
  }

  /**监听屏幕的点击事件 */
  touchEventHandler(e) {
    
    e.preventDefault()

    if (databus.isMoving)
      return

    let cell = databus.getBubble(e.touches[0].clientX, e.touches[0].clientY)
    if(cell == null)
      return

    if (cell.color){
      if (databus.select){
        this.run.stopBlink(databus.select)
        /**选的同一个泡 */
        if (cell == databus.select){
          databus.select = null
          //console.log(this.run.actions)

          return
        }
      }

      databus.select = cell
      this.run.blink(cell)

    }
    else{
      if (databus.select){
        this.run.move(databus.select, cell)
        console.log(this.run.gameover)
      }
    }
    //console.log(this.run.actions)
  }

  // 实现游戏帧循环
  loop() {

    // 游戏结束停止帧循环
    if (this.run.gameover == true) {

      this.run.gameOver()

      return
    }

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )
  }
}
