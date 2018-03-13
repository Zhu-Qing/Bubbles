import Calculate from '../calculate/calculate.js'
import DataBus from '../databus'

let databus = new DataBus()

const COLORS = ["red", "#039518", "#ff00dc", "#ff6a00", "gray", "#0094ff", "#d2ce00"]

//const COLORS = ["red"]

const DIRECTS = [[1, 0], [0, 1], [1, 1], [1, 1]]

export default class Run {
  constructor(){

    this.mode = COLORS.length

    this.cal = new Calculate()

    this.actions = []

    this.gameover = false
  }

  clearLine(bubble){
    var line =[]
    var x,y
    var clear = false
    var color = bubble.color

    for (var i = 0; i < DIRECTS.length ; i++){
      //console.log("i=%d -----------------------------------------",i)
      line.push(bubble)

      x = bubble.x - DIRECTS[i][0]
      y = bubble.y - DIRECTS[i][1]
      while (x >= 0 && y >= 0 && x < 9 && y < 9){
        if (databus.bubble[x][y].color != color)
          break

        line.push(databus.bubble[x][y])
        x = x - DIRECTS[i][0]
        y = y - DIRECTS[i][1]
      }
      
      x = bubble.x + DIRECTS[i][0]
      y = bubble.y + DIRECTS[i][1]
      while (x >= 0 && y >= 0 && x < 9 && y < 9) {
        if (databus.bubble[x][y].color != color)
          break

        line.push(databus.bubble[x][y])
        x = x + DIRECTS[i][0]
        y = y + DIRECTS[i][1] 
      }

     //console.log(line)

      if (line.length >= 5) {
        line.forEach(function (cell) {
          //console.log(cell)
          cell.delBubble();
          clear = true
        })
        this.draw();
      }

      line = []
      //console.log("end -----------------------------------------")
    }

    if (clear == true)
      databus.select = null

    return clear
  }

  search(src, dst){
    return this.cal.search(src, dst)
  }

  getRandom() {
    return parseInt(Math.random() * 1000000 % (this.mode));
  }

  ready() {
    let emptyBubble = databus.getEmptyBubble()
    let color
    let x = 0
    console.log("emptyBubble=%d",emptyBubble.length)

    if (emptyBubble.length < 3){
      //console.log(emptyBubble.length)
      return false
    }

    for (var i = 0; i < 9; i++) {
      color = COLORS[this.getRandom()];
      x = parseInt(Math.random() * 1000000 % emptyBubble.length)
      //console.log(color)
      console.log("x=%d,i=%d,color=%s",x,i,color)
      emptyBubble[x].addBubble(color)
      this.clearLine(emptyBubble[x])
      //x = x + 1
    }

    return true
  }

  draw() {

    databus.map.draw(databus.ctx)

    for (var i = 0; i < databus.bubble.length; i++) {
      for (var j = 0; j < databus.bubble[i].length; j++) {
        if (databus.bubble[i][j].color){
          databus.bubble[i][j].draw(databus.ctx)
        }
      }
    }
  }

  gameOver(){

    databus.ctx.beginPath()
    databus.ctx.strokeStyle = "black"
    databus.ctx.strokeRect(20, 20, 20, 20)
    databus.ctx.strokeStyle = 'rgba(0,0,0,1)'
    databus.ctx.stroke()
    /*
    databus.ctx.strokeStyle = "#456";
    //ctx.strokeRect(0, 0, 150, 200);
    databus.ctx.font = "24px 微软雅黑";
    databus.ctx.fillStyle = "#fefefe";
    databus.ctx.fillText("游戏结束",0,30);
    databus.ctx.stroke();
    */

  }

  play(name, action, interval) {
    var me = this

    this.actions[name] = setInterval(function () {
      action();
      me.draw();
    }, interval || 50)
  }

  stop(name) {
    //console.log(name)
    clearInterval(this.actions[name]);
    this.draw();
  }

  blink(bubble) {
    var isUp = true
    var me = this

    this.play("light_" + bubble.x + "_" + bubble.y, function () {
      if (isUp) {
        bubble.light += 3;
      }

      if (!isUp) {
        bubble.light -= 3;
      }
      if (bubble.light >= 30) {
        isUp = false;
        //me.stop("light_" + bubble.x + "_" + bubble.y);

      }
      if (bubble.light <= 10) {
        isUp = true;
      }
    }, 100);
  }

  stopBlink(bubble) {
    //this.light = 10;
    var me = this

    this.stop("light_" + bubble.x + "_" + bubble.y);
    
    this.play("restore_" + bubble.x + "_" + bubble.y, function () {
      if (bubble.light > 10) {
        bubble.light--;
      }
      else {
        bubble.light = 10;
        me.stop("restore_" + bubble.x + "_" + bubble.y);
        clearInterval("restore_" + bubble.x + "_" + bubble.y);
      }
    }, 30);
  }

  move(bubble, target) {
    var path = this.search(bubble, target);
    if (!path) {
      //显示不能移动s
      //alert("过不去");
      return false;
    }

    this.stop("light_" + bubble.x + "_" + bubble.y);
    bubble.light = 10

    //map开始播放当前泡的移动效果
    //两种实现方式，1、map按路径染色，最后达到目的地 2、map生成一个临时的bubble负责展示，到目的地后移除
    //console.log(path);
    var me = this;
    var name = "move_" + bubble.x + "_" + bubble.y;
    var i = 0;
    var color = bubble.color;

    this.play(name, function () {
      if (i > path.length - 1) {
        me.stop(name);
        //game.clicked = null;
        databus.isMoving = false;
        //
        /*
        if(false == me.clearLine(target)){
          if(false == me.ready()){
            console.log("me.gameover = %d", me.gameover)
            me.gameover = true
            return
          }
        }
        */
        me.ready()
        return;
      }
      databus.isMoving = true;
      
      path.forEach(function (cell) {
        cell.delBubble();
      });
      
      var currentCell = path[i];
      //console.log(currentCell)
      currentCell.addBubble(color);
      i++;
    }, 50);

    return true
  }

}