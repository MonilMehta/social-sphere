"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Sphere, Sparkles } from "@react-three/drei"
import * as THREE from "three"

function DiscoBall() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Create a repeating mirror tile texture pattern
  const mirrorPattern = new THREE.DataTexture(
    new Uint8Array([255, 255, 255, 255]),
    1, 1,
    THREE.RGBAFormat
  )
  mirrorPattern.wrapS = mirrorPattern.wrapT = THREE.RepeatWrapping
  mirrorPattern.repeat.set(15, 15)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <>
      <Sphere ref={meshRef} args={[1, 64, 64]} castShadow>
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={1}
          roughness={0}
          envMapIntensity={3}
          clearcoat={1}
          clearcoatRoughness={0}
          normalScale={new THREE.Vector2(0.8, 0.8)}
          normalMap={mirrorPattern}
          flatShading={true}
        />
      </Sphere>
      <Sparkles 
        count={50}
        scale={3}
        size={1.5}
        speed={0.3}
        color="#ffffff"
      />
      {/* Rotating colored spotlights */}
      {Array.from({ length: 6 }).map((_, i) => (
        <RotatingLight 
          key={i} 
          index={i} 
          color={[
            '#ff0000', // Red
            '#00ff00', // Green
            '#0000ff', // Blue
            '#ffff00', // Yellow
            '#ff00ff', // Magenta
            '#00ffff'  // Cyan
          ][i]} 
        />
      ))}
    </>
  )
}

function RotatingLight({ index, color }: { index: number; color: string }) {
  const lightRef = useRef<THREE.SpotLight>(null)

  useFrame((state) => {
    if (lightRef.current) {
      const time = state.clock.elapsedTime
      const angle = time * 0.5 + (index * Math.PI / 3)
      const radius = 3
      lightRef.current.position.x = Math.cos(angle) * radius
      lightRef.current.position.z = Math.sin(angle) * radius
      lightRef.current.position.y = Math.sin(time + index) * 2
    }
  })

  return (
    <spotLight
      ref={lightRef}
      intensity={1.5}
      position={[3, 2, 0]}
      angle={0.15}
      penumbra={1}
      distance={6}
      color={color}
      castShadow
    />
  )
}

export default function DiscoBallComponent({ className = "" }: { className?: string }) {
  return (
    <div className={`w-40 h-40 ${className}`}>
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.1} />
        <DiscoBall />
        <Environment preset="night" />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
