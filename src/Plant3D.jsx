import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  useGLTF,
  Center,
  Environment,
  ContactShadows,
} from "@react-three/drei";

/* ---------------- Plant ---------------- */

function PlantModel() {
  const { scene } = useGLTF("/models/plant.glb");

  useEffect(() => {
    scene.traverse((obj) => {
      if (!obj.isMesh) return;

      obj.castShadow = true;
      obj.receiveShadow = true;

      const mat = obj.material;

      if (mat.emissiveMap) {
        mat.map = mat.emissiveMap;
        mat.emissiveMap = null;
      }

      mat.color.set("#ffffff");
      mat.emissive.set("#000000");
      mat.emissiveIntensity = 0;
      mat.roughness = 0.9;
      mat.metalness = 0.01;
      mat.envMapIntensity = 0.08;
      mat.needsUpdate = true;
    });
  }, [scene]);

  return <primitive object={scene} scale={2} />;
}

/* ---------------- Rock ---------------- */

function RockModel() {
  const { scene } = useGLTF("/models/rock.glb");

  useEffect(() => {
    scene.traverse((obj) => {
      if (!obj.isMesh) return;

      obj.castShadow = true;
      obj.receiveShadow = true;

      const mat = obj.material;

      if (mat.emissiveMap) {
        mat.map = mat.emissiveMap;
        mat.emissiveMap = null;
      }

      mat.color.set("#ffffff");
      mat.emissive.set("#000000");
      mat.emissiveIntensity = 0;
      mat.roughness = 0.98;
      mat.metalness = 0;
      mat.envMapIntensity = 0.03;
      mat.needsUpdate = true;
    });
  }, [scene]);

  return <primitive object={scene} position={[0, -2, 0]} scale={1.8} />;
}

/* ---------------- Interactive Rig ---------------- */

function Rig({ children }) {
  const group = useRef();

  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const rotation = useRef({
    x: 0,
    y: 0,
  });

  const mouse = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const move = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("pointermove", move);

    return () => {
      window.removeEventListener("pointermove", move);
    };
  }, []);

  useFrame(() => {
    if (!group.current) return;

    if (!dragging.current) {
group.current.rotation.x = THREE.MathUtils.lerp(
  group.current.rotation.x,
  rotation.current.x,
  0.08
);

group.current.rotation.y = THREE.MathUtils.lerp(
  group.current.rotation.y,
  rotation.current.y,
  0.08
);    }

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      rotation.current.y,
      0.08
    );

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      rotation.current.x,
      0.08
    );
  });

  const onPointerDown = (e) => {
    e.stopPropagation();

    dragging.current = true;

    last.current = {
      x: e.clientX,
      y: e.clientY,
    };

    document.body.style.cursor = "grabbing";
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    last.current = {
      x: e.clientX,
      y: e.clientY,
    };

    rotation.current.y += dx * 0.01;

    rotation.current.x = THREE.MathUtils.clamp(
      rotation.current.x + dy * 0.008,
      -0.6,
      0.6
    );
  };

  const onPointerUp = () => {
    dragging.current = false;
    document.body.style.cursor = "default";
  };

  return (
    <group
      ref={group}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerOut={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {children}
    </group>
  );
}

/* ---------------- Scene ---------------- */

export default function Plant3D() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
      }}
      camera={{
        position: [0, 0.7, 9.5],
        fov: 34,
      }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.7;
      }}
    >
      <fog attach="fog" args={["#ffffff", 10, 24]} />

      <Environment preset="studio" environmentIntensity={0.107} />

      <ambientLight intensity={0.02} />

      <directionalLight
        castShadow
        position={[8, 10, 6]}
        intensity={2.2}
        color="#ffe8c4"
      />

      <spotLight
        castShadow
        position={[6, 8, 5]}
        angle={0.28}
        penumbra={0.9}
        intensity={2}
        color="#ffe8c4"
      />

      <pointLight
        position={[-6, 3, -8]}
        intensity={0.18}
        color="#5f7392"
      />

      <Rig>
        <Center disableX>
          <group>
            <RockModel />
            <PlantModel />
          </group>
        </Center>
      </Rig>

      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.6}
        blur={2.6}
        scale={8}
        far={6}
      />
    </Canvas>
  );
}

useGLTF.preload("/models/plant.glb");
useGLTF.preload("/models/rock.glb");