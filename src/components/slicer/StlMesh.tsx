import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Center, Bounds } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";

interface StlMeshProps {
  file: File;
  mode: "prepare" | "preview" | "device";
}

const StlMesh = ({ file, mode }: StlMeshProps) => {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    let cancelled = false;
    const reader = new FileReader();
    reader.onload = (e) => {
      const buf = e.target?.result as ArrayBuffer;
      if (!buf || cancelled) return;
      const loader = new STLLoader();
      const geom = loader.parse(buf);
      geom.computeVertexNormals();
      setGeometry(geom);
    };
    reader.readAsArrayBuffer(file);
    return () => {
      cancelled = true;
    };
  }, [file]);

  const material = useMemo(() => {
    return mode === "preview"
      ? new THREE.MeshStandardMaterial({ color: "#4ade80", metalness: 0.1, roughness: 0.6, flatShading: true })
      : new THREE.MeshStandardMaterial({ color: "#3b82f6", metalness: 0.15, roughness: 0.55, flatShading: true });
  }, [mode]);

  return (
    <Canvas camera={{ position: [120, 120, 160], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={["#0a0f1a"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[100, 200, 100]} intensity={1.1} />
      <directionalLight position={[-100, -50, -100]} intensity={0.4} />

      <Grid
        args={[256, 256]}
        cellSize={10}
        cellThickness={0.6}
        cellColor="#1e3a5f"
        sectionSize={50}
        sectionThickness={1.2}
        sectionColor="#3b82f6"
        fadeDistance={400}
        fadeStrength={1}
        infiniteGrid={false}
        position={[0, 0, 0]}
      />

      {geometry && (
        <Bounds fit clip observe margin={1.4}>
          <Center>
            <mesh geometry={geometry} material={material} castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]} />
          </Center>
        </Bounds>
      )}

      <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
    </Canvas>
  );
};

export default StlMesh;