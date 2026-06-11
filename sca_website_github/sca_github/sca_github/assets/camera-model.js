import * as THREE from 'three';
import { FBXLoader } from './vendor/loaders/FBXLoader.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mount = document.querySelector('[data-camera-model]');
const story = document.querySelector('[data-camera-story]');

if (mount && story) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.18, 5.4);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);
  mount.style.cursor = 'grab';

  const rig = new THREE.Group();
  scene.add(rig);

  const dragGroup = new THREE.Group();
  rig.add(dragGroup);

  // High quality studio lighting optimized for light background
  const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
  keyLight.position.set(3.5, 4, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 2.0);
  fillLight.position.set(-3.5, 1, 3);
  scene.add(fillLight);

  const topLight = new THREE.DirectionalLight(0xffffff, 2.5);
  topLight.position.set(0, 5, 0);
  scene.add(topLight);

  const rimLight = new THREE.DirectionalLight(0x2257ff, 2.8);
  rimLight.position.set(-4, 2.2, -2.5);
  scene.add(rimLight);

  const warmLight = new THREE.PointLight(0xff5a1f, 2.6, 8);
  warmLight.position.set(2.2, -1.2, 2.8);
  scene.add(warmLight);

  scene.add(new THREE.HemisphereLight(0xf8f4ec, 0x050509, 2.0));

  const modelRoot = 'assets/models/canon-at-1/model/';
  const textureRoot = `${modelRoot}Textures/cam-textures-2k/`;
  const textureLoader = new THREE.TextureLoader();

  const loadTexture = (name, color = false) => {
    const texture = textureLoader.load(`${textureRoot}${name}`);
    texture.flipY = true;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    return texture;
  };

  const maps = {
    map: loadTexture('color.png', true),
    metalnessMap: loadTexture('metalness.png'),
    roughnessMap: loadTexture('roughness.png'),
    normalMap: loadTexture('normal.png'),
    aoMap: loadTexture('ao.png')
  };

  let model = null;
  const target = {
    progress: 0,
    pointerX: 0,
    pointerY: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    posX: 0,
    posY: 0
  };

  // Drag interaction variables
  let isDragging = false;
  const dragRot = { x: 0, y: 0 };
  const dragTarget = { x: 0, y: 0 };
  const startPointer = { x: 0, y: 0 };
  const startRot = { x: 0, y: 0 };

  const resize = () => {
    const rect = mount.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  const updateProgress = () => {
    const rect = story.getBoundingClientRect();
    const total = Math.max(1, rect.height - window.innerHeight);
    target.progress = Math.min(1, Math.max(0, -rect.top / total));
  };

  const pointerDown = (event) => {
    isDragging = true;
    mount.style.cursor = 'grabbing';
    startPointer.x = event.clientX;
    startPointer.y = event.clientY;
    startRot.x = dragTarget.x;
    startRot.y = dragTarget.y;
  };

  const pointerMove = (event) => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const rect = mount.getBoundingClientRect();
    
    if (!coarse) {
      target.pointerX = ((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
      target.pointerY = ((event.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
    }

    if (!isDragging) return;

    const deltaX = event.clientX - startPointer.x;
    const deltaY = event.clientY - startPointer.y;

    dragTarget.y = startRot.y + deltaX * 0.007;
    dragTarget.x = startRot.x + deltaY * 0.007;
  };

  const pointerUp = () => {
    isDragging = false;
    mount.style.cursor = 'grab';
  };

  new FBXLoader().load(
    `${modelRoot}Canon_AT-1.fbx`,
    (object) => {
      model = object;
      model.traverse((child) => {
        if (!child.isMesh) return;
        child.castShadow = true;
        child.receiveShadow = true;
        child.geometry.computeVertexNormals();
        child.material = new THREE.MeshStandardMaterial({
          ...maps,
          color: 0xffffff,
          metalness: 0.72,
          roughness: 0.48,
          normalScale: new THREE.Vector2(0.8, 0.8)
        });
      });

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      
      // Make it less zoomed in (using 2.35 instead of 3.15)
      model.scale.setScalar(2.35 / maxDim);
      model.position.sub(center.multiplyScalar(2.35 / maxDim));
      model.rotation.set(0.18, -0.72, -0.06);

      dragGroup.add(model);
      mount.classList.add('is-loaded');
    },
    undefined,
    (error) => {
      console.error('FBX Loader Error:', error);
      mount.classList.add('is-loaded');
      const fallback = mount.querySelector('.model-loading');
      if (fallback) fallback.textContent = 'Camera model unavailable: ' + (error && error.message ? error.message : error);
    }
  );

  const clock = new THREE.Clock();
  const render = () => {
    const elapsed = clock.getElapsedTime();
    updateProgress();

    const p = reduceMotion ? 0.18 : target.progress;
    const desiredRotX = 0.12 - p * 0.48 + target.pointerY * 0.1 + Math.sin(elapsed * 0.8) * 0.025;
    const desiredRotY = -0.82 + p * 1.7 + target.pointerX * 0.18 + Math.sin(elapsed * 0.55) * 0.04;
    const desiredRotZ = -0.08 + Math.sin(p * Math.PI) * 0.16 + target.pointerX * 0.035;
    const desiredPosX = -0.22 + p * 0.48 + target.pointerX * 0.08;
    const desiredPosY = Math.sin(p * Math.PI) * 0.22 - target.pointerY * 0.04;

    target.rotX += (desiredRotX - target.rotX) * 0.075;
    target.rotY += (desiredRotY - target.rotY) * 0.075;
    target.rotZ += (desiredRotZ - target.rotZ) * 0.075;
    target.posX += (desiredPosX - target.posX) * 0.075;
    target.posY += (desiredPosY - target.posY) * 0.075;

    rig.rotation.set(target.rotX, target.rotY, target.rotZ);
    rig.position.set(target.posX, target.posY, 0);
    rig.scale.setScalar(1 + Math.sin(p * Math.PI) * 0.08);

    // Apply smooth drag rotation to the dragGroup
    dragRot.x += (dragTarget.x - dragRot.x) * 0.075;
    dragRot.y += (dragTarget.y - dragRot.y) * 0.075;
    dragGroup.rotation.set(dragRot.x, dragRot.y, 0);

    warmLight.intensity = 2.05 + Math.sin(elapsed * 1.7) * 0.35 + p * 0.65;
    rimLight.intensity = 2.25 + p * 1.2;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  resize();
  updateProgress();
  render();

  window.addEventListener('resize', resize);
  window.addEventListener('scroll', updateProgress, { passive: true });
  mount.addEventListener('pointerdown', pointerDown);
  mount.addEventListener('pointermove', pointerMove);
  window.addEventListener('pointerup', pointerUp);
  mount.addEventListener('pointerleave', () => {
    if (!isDragging) {
      target.pointerX = 0;
      target.pointerY = 0;
    }
  });
}
