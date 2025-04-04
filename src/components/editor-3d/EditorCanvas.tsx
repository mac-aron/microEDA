// EditorCanvas.tsx
import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { VRMLLoader } from 'three/addons/loaders/VRMLLoader.js';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Button, Box } from '@mui/material';

// Modified Camera Controller with pan/zoom controls for edit mode
function CameraController({ isEditMode }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (isEditMode) {
      // Reset to top-down view when entering edit mode
      camera.position.set(0, 20, 0);
      camera.rotation.set(-Math.PI / 2, 0, 0);
      camera.updateProjectionMatrix();
    }
  }, [isEditMode, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      minDistance={1}
      maxDistance={300}
      enableDamping={true}
      enableRotate={!isEditMode} // Disable rotation in edit mode
      enablePan={true} // Always allow panning
      enableZoom={true} // Always allow zooming
      minPolarAngle={isEditMode ? Math.PI / 2 : 0} // Lock vertical rotation in edit mode
      maxPolarAngle={isEditMode ? Math.PI / 2 : Math.PI} // Lock vertical rotation in edit mode
    />
  );
}

function DraggableVRMLModel({ url, isEditMode }: { url: string; isEditMode: boolean }) {
  const modelRef = useRef<THREE.Object3D>();
  const object = useLoader(VRMLLoader, url);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPosition = useRef({ x: 0, z: 0 });
  const initialModelPosition = useRef({ x: 0, z: 0 });
  
  useEffect(() => {
    if (object) {
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      
      object.position.x = -center.x;
      object.position.y = -center.y;
      object.position.z = -center.z;

      const size = box.getSize(new THREE.Vector3());
      console.log('Model size:', size);
    }
  }, [object]);

  const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!isEditMode) return;
    event.stopPropagation();
    setIsDragging(true);
    
    dragStartPosition.current = { x: event.point.x, z: event.point.z };
    if (modelRef.current) {
      initialModelPosition.current = {
        x: modelRef.current.position.x,
        z: modelRef.current.position.z
      };
    }
  };

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !isEditMode || !modelRef.current) return;
    event.stopPropagation();
    
    const deltaX = event.point.x - dragStartPosition.current.x;
    const deltaZ = event.point.z - dragStartPosition.current.z;
    
    modelRef.current.position.x = initialModelPosition.current.x + deltaX;
    modelRef.current.position.z = initialModelPosition.current.z + deltaZ;
  };

  const onPointerUp = () => {
    if (!isEditMode) return;
    setIsDragging(false);
  };

  return (
    <primitive 
      ref={modelRef}
      object={object}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    />
  );
}

const defaultCameraSettings = {
  edit: {
    position: [0, 20, 0],
    rotation: [-Math.PI / 2, 0, 0],
    fov: 50,
    near: 0.1,
    far: 1000,
  },
  preview: {
    position: [5, 5, 5],
    fov: 60,
    near: 0.1,
    far: 1e10,
  }
};

function EditorCanvas() {
  const [isEditMode, setIsEditMode] = useState(false);
  const currentCamera = isEditMode ? defaultCameraSettings.edit : defaultCameraSettings.preview;

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Button 
        variant="contained"
        onClick={() => setIsEditMode(!isEditMode)}
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          zIndex: 1 
        }}
      >
        {isEditMode ? 'Preview Mode' : 'Edit Mode'}
      </Button>

      <Canvas camera={currentCamera}>
        {/* Using single CameraController for both modes */}
        <CameraController isEditMode={isEditMode} />
        
        <ambientLight intensity={1.2} />
        <directionalLight 
          position={[200, 200, 200]} 
          intensity={5.0} 
        />
        
        <axesHelper args={[5]} />
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={1}
          cellColor="#6f6f6f"
          sectionSize={5}
        />

        <Suspense fallback={null}>
          <DraggableVRMLModel 
            url="../../../public/ec30_5x2_lr_mh_0.1_ultrasonic_sensor.wrl"
            isEditMode={isEditMode}
          />
        </Suspense>
      </Canvas>
    </Box>
  );
}

export default EditorCanvas;