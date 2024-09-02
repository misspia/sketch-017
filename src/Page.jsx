import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useWindowSize } from './useWindowSize';
import { Tooltip } from "./Tooltip"
import { MediaActivator } from "./MediaActivator"
import { audioMeta } from './audio'

import { Sketch } from './Sketch';

export default function Page() {
  const [isReady, setIsReady] = useState(false)
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const sketch = useMemo(() => {
    if (!canvasRef.current) {
      return;
    }
    return new Sketch(
      canvasRef.current,
      audioRef.current
    );
  }, [canvasRef.current]);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!sketch) {
      return;
    }
    sketch.resize(width, height)
  }, [sketch, width, height]);

  useEffect(() => {
    // if (!sketch || !isReady) {
    if (!sketch) {
      return;
    }
    sketch.render();
  }, [sketch, isReady]);

  return (
    <>
      {/* {
        !isReady &&
        <MediaActivator
          onClick={() => setIsReady(true)}
        />
      } */}
      <Tooltip>{audioMeta.title}</Tooltip>
      <canvas ref={canvasRef}></canvas>
      <audio ref={audioRef} loop />
    </>
  )
}
