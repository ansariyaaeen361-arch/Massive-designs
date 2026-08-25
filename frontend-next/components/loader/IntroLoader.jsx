import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { gsap } from '../../lib/gsap';
import { LOGO_PATH_D } from '../../lib/logoPath';

const SESSION_KEY = 'md_intro_loader_shown';
// Matches the source logo's diagonal gradient: near-white at the top-left arm,
// deepening to saturated brand green at the bottom-right leg.
const LIGHT_COLOR = new THREE.Color('#f4ffe4');
const DEEP_COLOR = new THREE.Color('#6fbf1a');
const DEPTH = 95;

function parseLogoShapes() {
  const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${LOGO_PATH_D}" fill-rule="evenodd"/></svg>`;
  const loader = new SVGLoader();
  const { paths } = loader.parse(svgMarkup);
  return paths.flatMap((path) => path.toShapes(true));
}

function colorizeDiagonally(geometry, min, max) {
  const colors = [];
  const position = geometry.attributes.position;
  const spanX = max.x - min.x || 1;
  const spanY = max.y - min.y || 1;
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const nx = (x - min.x) / spanX;
    const ny = (y - min.y) / spanY;
    // 0 at top-left corner, 1 at bottom-right corner.
    const t = THREE.MathUtils.clamp((nx + (1 - ny)) / 2, 0, 1);
    const c = LIGHT_COLOR.clone().lerp(DEEP_COLOR, t);
    colors.push(c.r, c.g, c.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
}

// A single chunky extrusion of the logo mark, beveled for a faceted, hard-edged
// 3D look matching the source design's low-poly style.
function buildLogoMesh() {
  const shapes = parseLogoShapes();

  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: 5,
    bevelSize: 4,
    bevelSegments: 3,
    curveSegments: 10,
  });

  geometry.scale(1, -1, 1);
  geometry.computeBoundingBox();
  const preCenter = new THREE.Vector3();
  geometry.boundingBox.getCenter(preCenter);
  geometry.translate(-preCenter.x, -preCenter.y, -preCenter.z);
  geometry.computeVertexNormals();

  geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  geometry.boundingBox.getSize(size);
  const scale = 3.1 / Math.max(size.x, size.y);
  geometry.scale(scale, scale, scale);
  geometry.computeBoundingBox();

  const { min, max } = geometry.boundingBox;
  colorizeDiagonally(geometry, min, max);

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness: 0.16,
    roughness: 0.32,
  });

  return { geometry, material, mesh: new THREE.Mesh(geometry, material) };
}

export default function IntroLoader({ onComplete }) {
  const mountRef = useRef(null);
  const overlayRef = useRef(null);
  const wordmarkRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 4, 5);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xb5f652, 1.3);
    rim.position.set(-4, -1.5, -3);
    scene.add(rim);

    const fill = new THREE.DirectionalLight(0xffffff, 0.5);
    fill.position.set(-3, 2, 4);
    scene.add(fill);

    const backFill = new THREE.DirectionalLight(0xffffff, 0.45);
    backFill.position.set(0, 0.5, -6);
    scene.add(backFill);

    const { geometry, material, mesh } = buildLogoMesh();

    const group = new THREE.Group();
    group.add(mesh);
    scene.add(group);

    group.rotation.y = THREE.MathUtils.degToRad(-35);
    group.rotation.x = THREE.MathUtils.degToRad(-8);

    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      const t = clock.getElapsedTime();
      group.rotation.x = THREE.MathUtils.degToRad(-8) + Math.sin(t * 0.7) * 0.035;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    const cleanupScene = () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = prevOverflow;
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };

    const tl = gsap.timeline({
      onComplete: () => {
        window.sessionStorage.setItem(SESSION_KEY, '1');
        cleanupScene();
        onComplete?.();
      },
    });

    const startY = THREE.MathUtils.degToRad(-35);
    const finalY = THREE.MathUtils.degToRad(-8);
    // An integer turn count lands the spin back at startY exactly (mod 360),
    // so the settle step below always ends facing the same near-front angle
    // no matter how many times it spins.
    const totalTurns = 2;
    const spunY = startY + totalTurns * Math.PI * 2;
    const spinState = { turns: 0 };

    tl.to(spinState, {
      turns: totalTurns,
      duration: 4.6,
      ease: 'power1.inOut',
      onUpdate: () => {
        group.rotation.y = startY + spinState.turns * Math.PI * 2;
      },
    })
      .to(group.rotation, { y: spunY + (finalY - startY), duration: 0.55, ease: 'power2.out' })
      .fromTo(
        wordmarkRef.current,
        { autoAlpha: 0, y: 10, letterSpacing: '0.5em' },
        { autoAlpha: 1, y: 0, letterSpacing: '0.35em', duration: 1, ease: 'power2.out' },
        1
      )
      .to({}, { duration: 0.6 })
      .to(overlayRef.current, { autoAlpha: 0, duration: 0.55, ease: 'power2.inOut' }, '>-0.05');

    return () => {
      tl.kill();
      cleanupScene();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black">
      <div ref={mountRef} className="h-40 w-40 sm:h-52 sm:w-52" />
      <p
        ref={wordmarkRef}
        className="mt-6 text-xs font-medium uppercase text-primary sm:text-sm"
        style={{ letterSpacing: '0.5em', opacity: 0 }}
      >
        Massive Designs
      </p>
    </div>
  );
}
