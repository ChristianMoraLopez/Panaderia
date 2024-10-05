import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib'; // Importar GLTFLoader

const Brush3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = mountRef.current;
    if (!currentRef) return;

    const { clientWidth: width, clientHeight: height } = currentRef;

    // Configuración de la escena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Fondo transparente
    currentRef.appendChild(renderer.domElement);

    // Configuración de la iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Cargar el modelo 3D (GLB)
    const loader = new GLTFLoader(); // Usar GLTFLoader para GLB
    loader.load(
      '/images/brush.glb', // Cambiar a la ruta de tu archivo GLB
      (gltf) => {
        const object = gltf.scene;

        // Ajustar posición y escala
        object.scale.set(0.5, 0.5, 0.5);
        object.position.set(0, 0, 0);
        scene.add(object);

        // Centrar la cámara en el objeto
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        camera.position.z = cameraZ * 1.5;
        camera.lookAt(center);

        // Función de animación
        const animate = () => {
          requestAnimationFrame(animate);
          object.rotation.y += 0.01; // Rotar el cepillo
          renderer.render(scene, camera);
        };
        animate();
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('Error al cargar el modelo 3D:', error);
      }
    );

    // Manejar el redimensionamiento de la ventana
    const handleResize = () => {
      const { clientWidth, clientHeight } = currentRef;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Limpieza
    return () => {
      if (currentRef && currentRef.contains(renderer.domElement)) {
        currentRef.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '400px' }} />;
};

export default Brush3D;
