/**
 * A*算法
 * 
 * 最小堆
 * http://blog.csdn.net/hrn1216/article/details/51465270
 * https://github.com/simplemain/astar/blob/master/src/com/simplemain/astar/MinHeap.java
 * 
 */
import Data from './data'
import DataBus from '../databus'

let databus = new DataBus()

const DIRECTS = [[1, 0], [0, 1], [-1, 0], [0, -1]]

export default class Calculate {
  constructor(){

  }

  closeAdd(point,close){
    close.push(point)
  }

  openAdd(data,open){
    var compare = function(ob1, ob2){
      let f1 = ob1.f
      let f2 = ob2.f
      return f2 - f1
    } 

    open.push(data)
    open.sort(compare)
  }

  openPop(open){
    return open.pop()
  }

  openFind(x,y,open) {
    for (var i = 0; i < open.length;i++){
      if (open[i].point.x == x && open[i].point.y == y)
        return open[i]
    }

    return false
  }

  openPrint(open) {
    for (var i = 0; i < open.length; i++) {
      console.log("open%d.f=%d", i, open[i].f)
    }
  }

  closeFind(x, y,close) {
    for (var i = 0; i < close.length; i++) {
      if (close[i].x == x && close[i].y == y)
        return close[i]
    }

    return false
  }

  hManhattanDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  search(src,dst){
    var finish = false
    var midx
    var midy
    var open = []
    var close = []
    var path = []
    var lastData = null

    console.log("search %d %d -> %d %d",src.x,src.y,dst.x,dst.y)

    this.openAdd(new Data(src, 0, 0, null), open)
    
    while (open.length != 0 && !finish){

      var data = this.openPop(open)
      
      this.closeAdd(data.point,close)

      //console.log("s---------------------------------------------")
      for (var i = 0; i < DIRECTS.length;i++ ){
        midx = data.point.x + DIRECTS[i][0]
        midy = data.point.y + DIRECTS[i][1]
        //console.log("mid:x=%d,y=%d",midx,midy)

        if (midx >= 0 && midx < databus.map.cellCount && midy >= 0 && midy < databus.map.cellCount){
          var mid = databus.bubble[midx][midy]

          /**找到目的点 */
          if (mid.x == dst.x && mid.y == dst.y){
            lastData = data
            finish = true
            break;
          }
          
          /**该点有球 */
          if (mid.color){
            continue
          }

          /**该点被访问过 */
          if (this.closeFind(mid.x, mid.y, close)){
            continue
          }

          var inQueueData = this.openFind(mid.x, mid.y, open)
          if (inQueueData){
            if (inQueueData.g > data.g + 1) {
              inQueueData.g = data.g + 1;
              inQueueData.parent = data;
            }
          }
          else{
            var h = this.hManhattanDistance(mid, dst)

            var newData = new Data(mid, data.g + 1, h, data);

            this.openAdd(newData, open);

            //this.openPrint()
          }
        }
      }
      //console.log("e---------------------------------------------")

    }

    if (finish == true){
      let temp = lastData

      while (temp.parent != null) {
        path.push(temp.point)
        temp = temp.parent
      }

      path.push(src)
      path.reverse()
      path.push(dst)

      return path
    }

    return null
  }
}