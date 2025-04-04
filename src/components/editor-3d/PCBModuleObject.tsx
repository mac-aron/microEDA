// PCBModuleObject.tsx
import { useLoader } from '@react-three/fiber';
import { VRMLLoader } from 'three/addons/loaders/VRMLLoader.js';
import { PlacedModule } from '../../types';

interface PCBModuleObjectProps {
  module: PlacedModule;
}

export function PCBModuleObject({ module }: PCBModuleObjectProps) {
  const object = useLoader(VRMLLoader, module.modelUrl);

  return (
    <primitive
      object={object}
      position={module.position}
      rotation={module.rotation}
    />
  );
}