// types.ts
export interface PCBModule {
  id: string;
  name: string;
  modelUrl: string;
}

export interface PlacedModule extends PCBModule {
  position: [number, number, number];
  rotation: [number, number, number];
}
