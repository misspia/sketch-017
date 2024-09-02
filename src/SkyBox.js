import * as THREE from 'three'
import utils from './utils'


export const WIDTH = 160
export const DEPTH = 130
export const HEIGHT = 90

export class SkyBox {
  constructor() {
    this.group = new THREE.Group()

    this.geometry = new THREE.Geometry()

    // this.createFloor()
    this.createBackWall()
    this.createSideWalls()

    this.material = new THREE.MeshStandardMaterial({ 
      color: 0xffff00, 
      emissive: 0x000000,
      roughness: 0,
      metalness: 0,
      depthTest: true,
      depthWrite: true,
      alphaTest: 0,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.receiveShadow = true
    this.group.add(this.mesh)
  }

  createFloor() {
    const geometry = new THREE.PlaneGeometry(WIDTH, DEPTH)
    const floor = new THREE.Mesh(geometry, this.material) 
    floor.rotation.x = -Math.PI * 0.5
    floor.updateMatrix()

    this.geometry.merge(this.floor.geometry, this.floor.matrix)
  }

  createBackWall() {
    const geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT)
    this.backWall = new THREE.Mesh(geometry, this.material)
    this.backWall.position.set(0, HEIGHT / 2, -DEPTH / 2)
    this.backWall.updateMatrix()
    
    this.geometry.merge(this.backWall.geometry, this.backWall.matrix)
  }

  createSideWalls() {
    const geometry = new THREE.PlaneGeometry(DEPTH, HEIGHT)
    
    const leftWall = new THREE.Mesh(geometry, this.material)
    const rightWall = leftWall.clone()
    const bottomWall = leftWall.clone()
    const topWall = leftWall.clone()
    

    leftWall.rotateY(utils.toRadians(90)) 
    leftWall.translateZ(-WIDTH / 2)
    leftWall.translateY(HEIGHT / 2)
    leftWall.updateMatrix()

    rightWall.rotateY(-utils.toRadians(90)) 
    rightWall.translateZ(-WIDTH / 2)
    rightWall.translateY(HEIGHT / 2)
    rightWall.updateMatrix()

    bottomWall.scale.set(WIDTH / HEIGHT, 3, 1)
    bottomWall.rotateX(-utils.toRadians(90));
    bottomWall.translateY(HEIGHT / 2);
    bottomWall.updateMatrix();
    
    topWall.scale.set(WIDTH / HEIGHT, 3.5, 1)
    topWall.rotateX(-utils.toRadians(80));
    topWall.translateZ(HEIGHT);
    topWall.updateMatrix();
    
    this.geometry.merge(leftWall.geometry, leftWall.matrix)
    this.geometry.merge(rightWall.geometry, rightWall.matrix)
    this.geometry.merge(bottomWall.geometry, bottomWall.matrix)
    this.geometry.merge(topWall.geometry, topWall.matrix)
  }

  

  get position() {
    return this.group.position
  }

  update() {
    
  }
}
