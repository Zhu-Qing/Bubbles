
export default class Data {
  constructor(point,g,h,parent){

    this.point = point
    this.g = g
    this.h = h
    this.parent = parent
    this.f = this.g + this.h
    this.child = null

  }
}