import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Water } from 'three-stdlib';

const TransparentWaterEffect: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<Water | null>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 100, 150);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Water geometry
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load('/images/pexels-mattycphoto-1147124.jpg', (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
      }),
      sunDirection: new THREE.Vector3(50, 100, 50),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: false,
    });
    water.rotation.x = -Math.PI / 2;
    scene.add(water);
    waterRef.current = water;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(-1, 1, 1);
    scene.add(directionalLight);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 1.0 / 60.0;
      water.material.uniforms['time'].value = time;
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize, false);

    // Fade in effect
    const fadeIn = () => {
        setOpacity((prevOpacity) => {
          if (prevOpacity < 1) {
            requestAnimationFrame(fadeIn);
            return Math.min(prevOpacity + 0.02, 1); // Limitar la opacidad a 1
          }
          return prevOpacity;
        });
      };
      
    fadeIn();

    // Interaction
    const createRipple = (x: number, y: number) => {
      if (waterRef.current) {
        const uniforms = waterRef.current.material.uniforms;
        if (uniforms['ripples']) {
          uniforms['ripples'].value.push({
            position: new THREE.Vector3(x, y, 0),
            time: time,
            strength: 0.01,
            radius: 0.1,
          });
        }
      }
    };

    const handleInteraction = (event: MouseEvent | TouchEvent) => {
      const rect = mountRef.current!.getBoundingClientRect();
      const x = ((event instanceof MouseEvent ? event.clientX : event.touches[0].clientX) - rect.left) / rect.width * 2 - 1;
      const y = -((event instanceof MouseEvent ? event.clientY : event.touches[0].clientY) - rect.top) / rect.height * 2 + 1;
      createRipple(x, y);
    };

    mountRef.current.addEventListener('mousemove', handleInteraction);
    mountRef.current.addEventListener('touchmove', handleInteraction);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeEventListener('mousemove', handleInteraction);
      mountRef.current?.removeEventListener('touchmove', handleInteraction);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 1,
        pointerEvents: 'auto',
        opacity: opacity,
        transition: 'opacity 2s ease-in-out',
        mixBlendMode: 'overlay',
      }} 
    />
  );
};

export default TransparentWaterEffect;