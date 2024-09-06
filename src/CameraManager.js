import * as THREE from 'three'
import utils from './utils';

const X_MIN_THRESHOLD = -5;
const X_MAX_THRESHOLD = 5;
const Y_MIN_THRESHOLD = -1;
const Y_MAX_THRESHOLD = 1;
const Z_MIN_THRESHOLD = 2;
const Z_MAX_THRESHOLD = 65;

const Y_MIN_ROTATION_THRESHOLD = -utils.toRadians(10);
const Y_MAX_ROTATION_THRESHOLD = utils.toRadians(10);

const Z_MIN_ROTATION_THRESHOLD = -utils.toRadians(10);
const Z_MAX_ROTATION_THRESHOLD = utils.toRadians(10);

const MIN_X_VELOCITY = 0;
const MAX_X_VELOCITY = 0.2;
const MIN_Y_VELOCITY = 0;
const MAX_Y_VELOCITY = 0.2;
const MIN_Z_VELOCITY = 0;
const MAX_Z_VELOCITY = 1.8;

const MIN_Y_ROTATION_VELOCITY = utils.toRadians(0);
const MAX_Y_ROTATION_VELOCITY = utils.toRadians(1.2);
const MIN_Z_ROTATION_VELOCITY = utils.toRadians(0);
const MAX_Z_ROTATION_VELOCITY = utils.toRadians(0.8);


/**
 * https://stackoverflow.com/questions/60013404/threejs-how-to-make-the-camera-shake 
 */
export class CameraManager {
  constructor(context) {
    this.context = context
    this.camera = context.camera;

    this.direction = new THREE.Vector3(1, 1, 1);
    this.rotationDirection = new THREE.Vector3(1, 1, 1);

    this.rotation = new THREE.Vector3(0, 0, 0)
    this.rotationZ = 0;

    this.box = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    )

  }

  rotateSceneItems(x, y, z) {
    this.context.skyBox.group.rotation.set(x, y, z);
    this.context.dots.group.rotation.set(x, y, z);
    this.context.comics.group.rotation.set(x, y, z);
    this.context.lines.group.rotation.set(x, y, z);
  }

  update() {
    // const beatAverage = this.context.beatManager.latestOverallAverage;
    const beatAverage = this.context.beatManager.latestHighrangeAverage;

    const { x, y, z } = this.camera.position;
  
    if(x >= X_MAX_THRESHOLD || x <= X_MIN_THRESHOLD) {
      this.direction.x = -this.direction.x;
    } 
    if(y >= Y_MAX_THRESHOLD || y <= Y_MIN_THRESHOLD) {
      this.direction.y = -this.direction.y;
    } 
    if(z >= Z_MAX_THRESHOLD || z <= Z_MIN_THRESHOLD) {
      this.direction.z = -this.direction.z;
    } 

    if(this.rotation.y >= Y_MAX_ROTATION_THRESHOLD || this.rotation.y <= Y_MIN_ROTATION_THRESHOLD) {
      this.rotationDirection.y = -this.rotationDirection.y;
    } 
    if(this.rotation.z >= Z_MAX_ROTATION_THRESHOLD || this.rotation.z <= Z_MIN_ROTATION_THRESHOLD) {
      this.rotationDirection.z = -this.rotationDirection.z;
    } 

    this.context.setCameraPos(
      x, y,
      // x + utils.remapFreq(MIN_X_VELOCITY, MAX_X_VELOCITY, beatAverage) * this.direction.x,
      // y + utils.remapFreq(MIN_Y_VELOCITY, MAX_Y_VELOCITY, beatAverage) * this.direction.y, 
      z + utils.remapFreq(MIN_Z_VELOCITY, MAX_Z_VELOCITY, beatAverage) * this.direction.z
    );

    this.rotation.y += utils.remapFreq(MIN_Y_ROTATION_VELOCITY, MAX_Y_ROTATION_VELOCITY, beatAverage) * this.rotationDirection.y; 
    this.rotation.z += utils.remapFreq(MIN_Z_ROTATION_VELOCITY, MAX_Z_ROTATION_VELOCITY, beatAverage) * this.rotationDirection.z; 
    this.rotateSceneItems(this.rotation.x, this.rotation.y, this.rotation.z);

    // this.context.lookAt(0, 15, 0);
    this.camera.updateProjectionMatrix();
  }
}
