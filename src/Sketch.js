import * as THREE from 'three';
import { audioMeta } from './audio'

import { PostProcessor } from './PostProcessor';
import { SketchManager } from './SketchManager';
import { BeatManager } from './BeatManager';
import { EffectManager } from "./EffectManager"
import { CameraManager } from './CameraManager'

import { SkyBox } from './SkyBox'
import { Text } from './Text'
import { OFFSET_Y } from './Jojo'
import { Lights } from './lights'
import { Dots } from './Dots'
import { Comics } from './Comics'
import { Lines } from './Lines'

export class Sketch extends SketchManager {
  constructor(canvas, audioElement) {
    super(canvas, audioElement);
    this.audioSrc = audioMeta.url;

    this.clock = new THREE.Clock();
    this.effectManager = new EffectManager(this);

    this.spectrumStart = {
      bass: 0,
      midrange: 24,
      highrange: 185,
    }
    this.numFrequencyNodes = 345;
    this.beatManager = new BeatManager(this)
    this.pp = new PostProcessor(this);
    this.fftSize = 512;

    this.skyBox = new SkyBox(this)
    this.text = new Text(this)
    this.lights = new Lights(this)
    this.dots = new Dots(this)
    this.comics = new Comics(this)
    this.lines = new Lines(this)
    this.cameraManager = new CameraManager(this)

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
  }

  unmount() {

  }

  customResize() {
    this.dots.onResize()
  }

  init() {
    this.setCameraPos(0, 0, 40);
    this.lookAt(0, 15, 0);

    this.setClearColor(0x000000);

    const audioConfig = {
      fftSize: this.fftSize,
      dataLength: this.numFrequencyNodes,
    };
    this.initAudio(audioConfig);
    this.audio.setSmoothingTimeConstant(0.75);
    this.audio.volume(1)

    this.scene.add(this.skyBox.group)
    // this.scene.add(this.text.group)
    this.scene.add(this.dots.group)
    this.scene.add(this.comics.group)
    this.scene.add(this.lines.group)
    this.scene.add(this.lights.group)

    this.comics.position.set(0, OFFSET_Y, 0)
    this.skyBox.position.set(0, OFFSET_Y, 0)
    this.lines.position.set(0, OFFSET_Y, 0)
    this.lights.spot.position.set(-15, 30, 30)
    this.lights.spotHelper.update()

  }

  draw() {
    this.audio.getByteFrequencyData();
    this.beatManager.update();
    this.effectManager.update()
    
    this.dots.update()
    this.comics.update()
    this.lines.update()
    this.text.update()
    
    this.cameraManager.update()

    this.effectManager.render();
    requestAnimationFrame(() => this.draw());
  }
}
