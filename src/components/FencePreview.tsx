import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface FencePreviewProps {
  fenceConfig: any;
}

const FencePreview: React.FC<FencePreviewProps> = ({ fenceConfig }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Helper grid
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Create fence based on fenceConfig
    const createFence = () => {
      // Remove existing fence
      scene.children = scene.children.filter(child => !(child instanceof THREE.Mesh));
      scene.add(gridHelper, ambientLight, directionalLight);

      if (!fenceConfig.layout || fenceConfig.layout.length < 2) return;

      const layout = fenceConfig.layout;
      const panelMaterial = new THREE.MeshPhongMaterial({ color: fenceConfig.panels[0]?.color === '7037' ? 0x7f7f7f : 0x000000 });
      const postMaterial = new THREE.MeshPhongMaterial({ color: 0x4a4a4a });

      for (let i = 1; i < layout.length; i++) {
        const start = new THREE.Vector3(layout[i - 1].x, 0, layout[i - 1].y);
        const end = new THREE.Vector3(layout[i].x, 0, layout[i].y);
        const direction = end.clone().sub(start);
        const length = direction.length();
        const panelCount = Math.round(length / 1.5);

        // Create posts
        const postGeometry = new THREE.BoxGeometry(0.06, 2.4, 0.04);
        const startPost = new THREE.Mesh(postGeometry, postMaterial);
        startPost.position.set(start.x, 1.2, start.z);
        scene.add(startPost);

        if (i === layout.length - 1) {
          const endPost = new THREE.Mesh(postGeometry, postMaterial);
          endPost.position.set(end.x, 1.2, end.z);
          scene.add(endPost);
        }

        // Create panels
        for (let j = 0; j < panelCount; j++) {
          const panelStart = start.clone().add(direction.clone().multiplyScalar(j / panelCount));
          const panelEnd = start.clone().add(direction.clone().multiplyScalar((j + 1) / panelCount));
          const panelCenter = panelStart.clone().add(panelEnd).multiplyScalar(0.5);
          const panelLength = panelStart.distanceTo(panelEnd);

          const panelGeometry = new THREE.BoxGeometry(panelLength, 2.2, 0.02);
          const panel = new THREE.Mesh(panelGeometry, panelMaterial);
          panel.position.set(panelCenter.x, 1.1, panelCenter.z);

          const angle = Math.atan2(direction.z, direction.x);
          panel.rotation.y = angle;

          scene.add(panel);
        }
      }
    };

    createFence();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [fenceConfig]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">3D Preview</h2>
      <div ref={mountRef} className="w-full h-96"></div>
    </div>
  );
};

export default FencePreview;