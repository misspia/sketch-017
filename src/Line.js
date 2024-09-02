import { HEIGHT, DEPTH, WIDTH } from './SkyBox'
import utils from './utils'

export const Side = {
  LEFT_SIDE: 0,
  RIGHT_SIDE: 1,
  BOTTOM_SIDE: 2,
  TOP_SIDE: 3,
}

export class Line {
  constructor(freqIndex, side = Side.LEFT_SIDE) {
    this.freqIndex = freqIndex
    this.side = side

    this.minX = -WIDTH / 2;
    this.maxX = WIDTH / 2;
    
    this.minY = 0.5
    this.maxY = HEIGHT

    this.minZ = -DEPTH / 2
    this.maxZ = DEPTH / 2
    this.minIncrementZ = utils.randomFloatBetween(0.0, 0.0)
    this.maxIncrementZ = this.minIncrementZ + utils.randomFloatBetween(2.0, 2.7)

    const leftSideX = -WIDTH / 2 + 0.1 
    const rightSideX = WIDTH / 2 - 0.1
    const topSideY = HEIGHT - 0.1
    const bottomSideY = 0


    this.minLength = 1
    this.maxLength = 4
    this.length = utils.randomFloatBetween(this.minLength, this.maxLength)
    if(side === Side.LEFT_SIDE || side === Side.RIGHT_SIDE) {
      this.tail = {
        x: side === Side.LEFT_SIDE ? leftSideX : rightSideX,
        y: utils.randomFloatBetween(this.minY, this.maxY),
        z: utils.randomFloatBetween(this.minZ, this.maxZ),
      }
    } else {
      this.tail = {
        x: utils.randomFloatBetween(-50, 50),
        y: side === Side.TOP_SIDE ? topSideY : bottomSideY,
        z: utils.randomFloatBetween(this.minZ, this.maxZ),
      }
    }
    this.head = {
      ...this.tail,
      z: this.tail.z + this.length
    }
  }
  
  update(freq) {
    if(this.side === Side.LEFT_SIDE || this.side === Side.RIGHT_SIDE) {
      if(this.tail.z >= this.maxZ) {
        this.length = utils.randomFloatBetween(this.minLength, this.maxLength)
        this.head.z = this.minZ
        this.tail.z -= this.length
  
        const y = utils.randomFloatBetween(this.minY, this.maxY)
        this.tail.y = y
        this.head.y = y
      } else {
        const zIncrement = utils.remapFreq(this.minIncrementZ, this.maxIncrementZ, freq)
        this.head.z += zIncrement 
        this.tail.z += zIncrement 
      }
    } else {
      if(this.tail.z >= this.maxZ) {
        this.length = utils.randomFloatBetween(this.minLength, this.maxLength)
        this.head.z = this.minZ
        this.tail.z -= this.length

        const x = utils.randomFloatBetween(this.minX, this.maxX)
        this.tail.x = x
        this.head.x = x
      } else {
        const zIncrement = utils.remapFreq(this.minIncrementZ, this.maxIncrementZ, freq)
        this.head.z += zIncrement 
        this.tail.z += zIncrement 
      }
    }

  }
}
