// src/components/VantaBackground.jsx

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import NET from 'vanta/dist/vanta.net.min'

const VantaBackground = () => {
  const vantaRef = useRef(null)
  const vantaEffect = useRef(null)

  useEffect(() => {
    const setVanta = () => {
      if (!vantaEffect.current) {
        vantaEffect.current = NET({
          el: vantaRef.current,
          THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x4dff3f,
            backgroundColor: 0x21504,
            showDots: false
        })
      }
    }

    setVanta()

    return () => {
      if (vantaEffect.current) vantaEffect.current.destroy()
    }
  }, [])

  return (
    <div
      ref={vantaRef}
      className="w-full h-screen fixed top-0 left-0 -z-10"
    />
  )
}

export default VantaBackground
