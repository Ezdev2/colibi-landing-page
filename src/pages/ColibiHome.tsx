'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Home,
  Layers,
  Undo2,
  Redo2,
  Settings,
  ShoppingBag,
  User,
  ChevronRight,
  ChevronLeft,
  X,
  Ruler,
  ArrowUp,
  ArrowDown,
  Paintbrush,
  Square,
  LayoutGrid,
  Wallpaper,
  Palette,
  Sofa,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildPath, getMarket } from "../shared/utils";

/* ============================================================================
   TYPES
============================================================================ */

type FloorId = 0 | 1;
type ToolMode = 'select' | 'measure' | 'paintWall' | 'placeFurniture';
type WallMaterial = 'brick' | 'concrete';
type FloorMaterial = 'oak' | 'tile' | 'concrete' | 'marble';
type TextureScope = 'floor' | 'wall' | 'all';
type LeftPanelTab = 'rooms' | 'walls' | 'textures' | 'furniture';

interface RoomModel {
  id: string;
  floorId: FloorId;
  name: string;
  x: number;
  z: number;
  w: number;
  h: number;
}

interface WallModel {
  id: string;
  floorId: FloorId;
  start: [number, number];
  end: [number, number];
  material: WallMaterial;
}

interface FurnitureCatalogItem {
  id: string;
  name: string;
  price: number;
  type: 'sofa' | 'plant' | 'bed' | 'table';
  color: string;
}

interface FurnitureInstance {
  id: string;
  catalogId: string;
  floorId: FloorId;
  x: number;
  z: number;
  rotation: number;
}

interface PropertyModel {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  floorsCount: number;
  rooms: RoomModel[];
  walls: WallModel[];
  furnitures: FurnitureInstance[];
}

interface WorkspaceHit {
  point: [number, number];
  wallId?: string | null;
  furnitureId?: string | null;
}

const METERS_PER_UNIT = 1;

/* ============================================================================
   MOCK DATA
============================================================================ */

const FURNITURE_CATALOG: FurnitureCatalogItem[] = [
  { id: 'meuble-sofa', name: 'Canapé Oslo', price: 420, type: 'sofa', color: '#475569' },
  { id: 'meuble-plant', name: 'Pot Vert', price: 120, type: 'plant', color: '#10b981' },
  { id: 'meuble-bed', name: 'Lit Nordic', price: 580, type: 'bed', color: '#94a3b8' },
  { id: 'meuble-table', name: 'Table Basse', price: 35, type: 'table', color: '#8b5e3c' },
];

const INITIAL_PROPERTIES: PropertyModel[] = [
  {
    id: 'prop-c5',
    name: 'Nouveau bien',
    createdAt: '18/06/2026 18:56',
    updatedAt: '18/06/2026 19:03',
    floorsCount: 2,
    rooms: [
      { id: 'r1', floorId: 0, name: 'Salon', x: -4, z: -3, w: 4, h: 3 },
      { id: 'r2', floorId: 0, name: 'Cuisine', x: 0, z: -3, w: 4, h: 3 },
      { id: 'r3', floorId: 0, name: 'Entrée', x: -4, z: 0, w: 2, h: 3 },
      { id: 'r4', floorId: 0, name: 'Bureau', x: -2, z: 0, w: 6, h: 3 },
      { id: 'r5', floorId: 1, name: 'Chambre 1', x: -4, z: -3, w: 4, h: 3 },
      { id: 'r6', floorId: 1, name: 'Chambre 2', x: 0, z: -3, w: 4, h: 3 },
      { id: 'r7', floorId: 1, name: 'Couloir', x: -4, z: 0, w: 3, h: 3 },
      { id: 'r8', floorId: 1, name: "Salle d'eau", x: -1, z: 0, w: 2, h: 3 },
      { id: 'r9', floorId: 1, name: 'Balcon', x: 1, z: 0, w: 3, h: 3 },
    ],
    walls: [
      { id: 'w1', floorId: 0, start: [-4, -3], end: [4, -3], material: 'brick' },
      { id: 'w2', floorId: 0, start: [4, -3], end: [4, 3], material: 'brick' },
      { id: 'w3', floorId: 0, start: [4, 3], end: [-4, 3], material: 'brick' },
      { id: 'w4', floorId: 0, start: [-4, 3], end: [-4, -3], material: 'brick' },
      { id: 'w5', floorId: 0, start: [0, -3], end: [0, 0], material: 'concrete' },
      { id: 'w6', floorId: 0, start: [-2, 0], end: [-2, 3], material: 'concrete' },
      { id: 'w7', floorId: 1, start: [-4, -3], end: [4, -3], material: 'brick' },
      { id: 'w8', floorId: 1, start: [4, -3], end: [4, 3], material: 'brick' },
      { id: 'w9', floorId: 1, start: [4, 3], end: [-4, 3], material: 'brick' },
      { id: 'w10', floorId: 1, start: [-4, 3], end: [-4, -3], material: 'brick' },
      { id: 'w11', floorId: 1, start: [0, -3], end: [0, 0], material: 'concrete' },
      { id: 'w12', floorId: 1, start: [-1, 0], end: [-1, 3], material: 'concrete' },
      { id: 'w13', floorId: 1, start: [1, 0], end: [1, 3], material: 'concrete' },
    ],
    furnitures: [
      { id: 'f1', catalogId: 'meuble-sofa', floorId: 0, x: -2.5, z: -1.5, rotation: 0 },
      { id: 'f2', catalogId: 'meuble-table', floorId: 0, x: 2, z: -1.4, rotation: 0 },
      { id: 'f3', catalogId: 'meuble-plant', floorId: 0, x: 3.2, z: 1.8, rotation: 0 },
      { id: 'f4', catalogId: 'meuble-bed', floorId: 1, x: -2.2, z: -1.2, rotation: 0 },
      { id: 'f5', catalogId: 'meuble-plant', floorId: 1, x: 2.6, z: 1.5, rotation: 0 },
    ],
  },
  {
    id: 'prop-a1',
    name: 'Nouveau bien A1',
    createdAt: '19/06/2026 11:10',
    updatedAt: '19/06/2026 11:42',
    floorsCount: 2,
    rooms: [
      { id: 'ra1', floorId: 0, name: 'Séjour', x: -3.5, z: -2.5, w: 7, h: 5 },
      { id: 'ra2', floorId: 1, name: 'Suite', x: -3.5, z: -2.5, w: 7, h: 5 },
    ],
    walls: [
      { id: 'wa1', floorId: 0, start: [-3.5, -2.5], end: [3.5, -2.5], material: 'brick' },
      { id: 'wa2', floorId: 0, start: [3.5, -2.5], end: [3.5, 2.5], material: 'brick' },
      { id: 'wa3', floorId: 0, start: [3.5, 2.5], end: [-3.5, 2.5], material: 'brick' },
      { id: 'wa4', floorId: 0, start: [-3.5, 2.5], end: [-3.5, -2.5], material: 'brick' },
      { id: 'wa5', floorId: 1, start: [-3.5, -2.5], end: [3.5, -2.5], material: 'concrete' },
      { id: 'wa6', floorId: 1, start: [3.5, -2.5], end: [3.5, 2.5], material: 'concrete' },
      { id: 'wa7', floorId: 1, start: [3.5, 2.5], end: [-3.5, 2.5], material: 'concrete' },
      { id: 'wa8', floorId: 1, start: [-3.5, 2.5], end: [-3.5, -2.5], material: 'concrete' },
    ],
    furnitures: [
      { id: 'fa1', catalogId: 'meuble-sofa', floorId: 0, x: 0, z: 0, rotation: 0 },
      { id: 'fa2', catalogId: 'meuble-plant', floorId: 1, x: 1.8, z: 1.6, rotation: 0 },
    ],
  },
];

const ROOM_TYPES = [
  { name: 'Salon', color: '#dbeafe' },
  { name: 'Chambre', color: '#fce7f3' },
  { name: 'Cuisine', color: '#dcfce7' },
  { name: 'Salle de bain', color: '#fef9c3' },
  { name: 'Bureau', color: '#ede9fe' },
  { name: 'Couloir', color: '#f1f5f9' },
  { name: 'Entrée', color: '#fff7ed' },
  { name: 'Balcon', color: '#ecfdf5' },
];

/* ============================================================================
   HELPERS
============================================================================ */

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function distancePointToSegment(
  px: number, py: number,
  x1: number, y1: number,
  x2: number, y2: number
) {
  const A = px - x1, B = py - y1, C = x2 - x1, D = y2 - y1;
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = lenSq !== 0 ? dot / lenSq : -1;
  const xx = param < 0 ? x1 : param > 1 ? x2 : x1 + param * C;
  const yy = param < 0 ? y1 : param > 1 ? y2 : y1 + param * D;
  return Math.sqrt((px - xx) ** 2 + (py - yy) ** 2);
}

function getFloorLabel(floor: FloorId) {
  return floor === 0 ? 'RDC' : 'Étage 1';
}

function getCatalogItem(catalogId: string) {
  return FURNITURE_CATALOG.find((i) => i.id === catalogId)!;
}

function getSurfaceForProperty(property: PropertyModel) {
  return property.rooms.reduce((acc, room) => acc + room.w * room.h, 0);
}

/** Improved brick texture: per-brick color variation, mortar, shadows */
function createWallTexture(type: WallMaterial) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (type === 'brick') {
    // Mortar background
    ctx.fillStyle = '#c4ae9a';
    ctx.fillRect(0, 0, 512, 512);

    const brickH = 40;
    const brickW = 96;
    const mortarThick = 6;

    for (let row = 0; row < Math.ceil(512 / brickH); row++) {
      const offset = (row % 2 === 0) ? 0 : brickW / 2;
      for (let col = -1; col < Math.ceil(512 / brickW) + 1; col++) {
        const bx = col * brickW + offset + mortarThick / 2;
        const by = row * brickH + mortarThick / 2;
        const bw = brickW - mortarThick;
        const bh = brickH - mortarThick;

        // Base brick color with variation
        const r = 155 + Math.floor(Math.random() * 45);
        const g = 60 + Math.floor(Math.random() * 30);
        const b = 40 + Math.floor(Math.random() * 20);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(bx, by, bw, bh);

        // Top highlight
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(bx, by, bw, 4);

        // Bottom shadow
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fillRect(bx, by + bh - 4, bw, 4);

        // Right shadow
        ctx.fillStyle = 'rgba(0,0,0,0.10)';
        ctx.fillRect(bx + bw - 3, by, 3, bh);

        // Surface speckle
        for (let s = 0; s < 8; s++) {
          const sx = bx + Math.random() * bw;
          const sy = by + Math.random() * bh;
          ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.08})`;
          ctx.beginPath();
          ctx.arc(sx, sy, Math.random() * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  } else {
    // Concrete: fine grain + veins + speckle
    ctx.fillStyle = '#8c97a7';
    ctx.fillRect(0, 0, 512, 512);

    // Fine grain
    for (let i = 0; i < 3000; i++) {
      const v = Math.random() > 0.5 ? 255 : 0;
      ctx.fillStyle = `rgba(${v},${v},${v},${Math.random() * 0.06})`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
    }

    // Random veins
    for (let v = 0; v < 5; v++) {
      ctx.strokeStyle = `rgba(0,0,0,${0.04 + Math.random() * 0.06})`;
      ctx.lineWidth = Math.random() * 1.5;
      ctx.beginPath();
      let vx = Math.random() * 512;
      let vy = Math.random() * 512;
      ctx.moveTo(vx, vy);
      for (let s = 0; s < 8; s++) {
        vx += (Math.random() - 0.5) * 80;
        vy += (Math.random() - 0.5) * 80;
        ctx.lineTo(vx, vy);
      }
      ctx.stroke();
    }

    // Speckle
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`;
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  return texture;
}

function dotGridStyle(): React.CSSProperties {
  return {
    backgroundColor: '#f8fafc',
    backgroundImage: `
      linear-gradient(rgba(203,213,225,0.6) 1px, transparent 1px),
      linear-gradient(90deg, rgba(203,213,225,0.6) 1px, transparent 1px),
      radial-gradient(circle, rgba(148,163,184,0.55) 1px, transparent 1px)
    `,
    backgroundSize: '68px 68px, 68px 68px, 34px 34px',
    backgroundPosition: '0 0, 0 0, 0 0',
  };
}

/* ============================================================================
   TEXTURE COMPONENTS
============================================================================ */

/** Renders a spherical-effect texture swatch with real Unsplash image + CSS fallback */
function TextureSphere({
  material,
  selected,
  onClick,
  label,
}: {
  material: WallMaterial;
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const unsplashUrl =
    material === 'brick'
      ? 'https://images.unsplash.com/photo-1495578942200-c5f5d2137def?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      : 'https://images.unsplash.com/photo-1534593963832-01c3595183bd?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  const fallbackStyle: React.CSSProperties =
    material === 'brick'
      ? {
          background:
            'repeating-linear-gradient(0deg, #c4ae9a 0px, #c4ae9a 5px, transparent 5px, transparent 38px), repeating-linear-gradient(90deg, #c4ae9a 0px, #c4ae9a 5px, transparent 5px, transparent 88px), #a24b24',
        }
      : { background: '#8c97a7' };

  return (
    <button onClick={onClick} className="group text-center">
      <div className="relative w-20 h-20 mx-auto">
        {/* Base: fallback CSS or image */}
        <div
          className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-200"
          style={imgError || !imgLoaded ? fallbackStyle : {}}
        >
          {!imgError && (
            <img
              src={unsplashUrl}
              alt={label}
              className="w-full h-full object-cover"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              style={{ display: imgLoaded ? 'block' : 'none' }}
            />
          )}

          {/* Sphere gloss overlay */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 45%, transparent 70%)',
            }}
          />
        </div>

        {/* Selection checkmark */}
        {selected && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#2B4C7E] rounded-full flex items-center justify-center shadow">
            <Check size={12} className="text-white" />
          </div>
        )}
      </div>
      <span className="text-[11px] text-center block mt-2 text-slate-600 font-medium">{label}</span>
    </button>
  );
}

/** Floor texture card with label */
function FloorTextureCard({
  id,
  label,
  selected,
  onClick,
}: {
  id: FloorMaterial;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  const previewStyle: React.CSSProperties = {
    oak: {
      background:
        'repeating-linear-gradient(90deg, #c8a165 0px, #c8a165 18px, #b8924f 18px, #b8924f 20px, #c8a165 20px, #c8a165 60px)',
    },
    tile: {
      background:
        'repeating-conic-gradient(#f5f5f5 0% 25%, #e8e8e8 0% 50%) 0 0 / 20px 20px',
    },
    concrete: {
      background: 'linear-gradient(135deg, #9ca3af, #6b7280)',
    },
    marble: {
      background: 'linear-gradient(120deg, #f9fafb, #e2e8f0, #f1f5f9, #cbd5e1)',
    },
  }[id] as React.CSSProperties;

  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
        selected ? 'border-[#2B4C7E] shadow-md' : 'border-transparent hover:border-slate-300'
      }`}
    >
      <div className="w-full h-14" style={previewStyle} />
      <div className="py-1 px-1 bg-white/80 text-center">
        <span className="text-[10px] font-medium text-slate-600">{label}</span>
      </div>
      {selected && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#2B4C7E] rounded-full flex items-center justify-center">
          <Check size={10} className="text-white" />
        </div>
      )}
    </button>
  );
}

/* ============================================================================
   MAIN
============================================================================ */

export default function ColibiHome() {
  const [properties, setProperties] = useState<PropertyModel[]>(INITIAL_PROPERTIES);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(INITIAL_PROPERTIES[0].id);

  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [currentFloor, setCurrentFloor] = useState<FloorId>(1);

  const [showHomeMenu, setShowHomeMenu] = useState(false);
  const [showFloorOptions, setShowFloorOptions] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showMyProperties, setShowMyProperties] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showWelcomeTooltip, setShowWelcomeTooltip] = useState(true);

  const [showAllFloors, setShowAllFloors] = useState(true);
  const [onlyShowCurrentFloor, setOnlyShowCurrentFloor] = useState(false);

  const [tool, setTool] = useState<ToolMode>('select');
  const [selectedWallId, setSelectedWallId] = useState<string | null>(null);
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(null);
  const [selectedWallMaterial, setSelectedWallMaterial] = useState<WallMaterial>('brick');
  const [selectedFloorMaterial, setSelectedFloorMaterial] = useState<FloorMaterial>('oak');
  const [textureScope, setTextureScope] = useState<TextureScope>('wall');
  const [pendingCatalogId, setPendingCatalogId] = useState<string | null>(null);
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);
  const [leftTab, setLeftTab] = useState<LeftPanelTab>('rooms');

  const [cart, setCart] = useState<Record<string, number>>({
    'meuble-table': 1,
    'meuble-plant': 1,
    'meuble-sofa': 1,
  });

  const selectedProperty = useMemo(
    () => properties.find((p) => p.id === selectedPropertyId)!,
    [properties, selectedPropertyId]
  );

  const cartLines = useMemo(
    () => FURNITURE_CATALOG.filter((i) => (cart[i.id] ?? 0) > 0),
    [cart]
  );

  const totalCartPrice = useMemo(
    () => cartLines.reduce((acc, item) => acc + item.price * (cart[item.id] ?? 0), 0),
    [cartLines, cart]
  );

  const totalSurface = useMemo(() => getSurfaceForProperty(selectedProperty), [selectedProperty]);

  const updateSelectedProperty = (recipe: (draft: PropertyModel) => void) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPropertyId) return p;
        const draft = deepClone(p);
        recipe(draft);
        draft.updatedAt = new Date().toLocaleString('fr-FR');
        return draft;
      })
    );
  };

  const addToCart = (catalogId: string) => {
    setCart((prev) => ({ ...prev, [catalogId]: (prev[catalogId] ?? 0) + 1 }));
  };

  const removeFromCart = (catalogId: string) => {
    setCart((prev) => ({
      ...prev,
      [catalogId]: Math.max(0, (prev[catalogId] ?? 0) - 1),
    }));
  };

  const beginPlacement = (catalogId: string) => {
    if ((cart[catalogId] ?? 0) <= 0) return;
    setPendingCatalogId(catalogId);
    setTool('placeFurniture');
    setShowCart(false);
  };

  const placeFurnitureAt = (catalogId: string, point: [number, number]) => {
    const qty = cart[catalogId] ?? 0;
    if (qty <= 0) return;

    updateSelectedProperty((draft) => {
      draft.furnitures.push({
        id: `f-${Date.now()}`,
        catalogId,
        floorId: currentFloor,
        x: Math.round(point[0] * 2) / 2,
        z: Math.round(point[1] * 2) / 2,
        rotation: 0,
      });
    });

    const nextQty = qty - 1;
    setCart((prev) => ({ ...prev, [catalogId]: nextQty }));
    if (nextQty <= 0) {
      setPendingCatalogId(null);
      setTool('select');
    }
  };

  const applyMaterialToWallOrFloor = (material: WallMaterial) => {
    setSelectedWallMaterial(material);
    updateSelectedProperty((draft) => {
      draft.walls = draft.walls.map((wall) => {
        if (selectedWallId) {
          return wall.id === selectedWallId ? { ...wall, material } : wall;
        }
        return wall.floorId === currentFloor ? { ...wall, material } : wall;
      });
    });
  };

  const removeSelectedFurniture = () => {
    if (!selectedFurnitureId) return;
    updateSelectedProperty((draft) => {
      draft.furnitures = draft.furnitures.filter((f) => f.id !== selectedFurnitureId);
    });
    setSelectedFurnitureId(null);
  };

  const handleWorkspaceHit = (hit: WorkspaceHit) => {
    if (tool === 'measure') {
      setSelectedWallId(null);
      setSelectedFurnitureId(null);
      setMeasurePoints((prev) =>
        prev.length === 0 ? [hit.point] : prev.length === 1 ? [prev[0], hit.point] : [hit.point]
      );
      return;
    }
    if (tool === 'paintWall') {
      if (hit.wallId) setSelectedWallId(hit.wallId);
      return;
    }
    if (tool === 'placeFurniture' && pendingCatalogId) {
      placeFurnitureAt(pendingCatalogId, hit.point);
      return;
    }
    setSelectedWallId(hit.wallId ?? null);
    setSelectedFurnitureId(hit.furnitureId ?? null);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedFurnitureId) {
        removeSelectedFurniture();
      }
      if (e.key === 'Escape') {
        setPendingCatalogId(null);
        setMeasurePoints([]);
        setTool('select');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedFurnitureId]);

  const measuredDistance =
    measurePoints.length === 2
      ? (
          Math.hypot(
            measurePoints[1][0] - measurePoints[0][0],
            measurePoints[1][1] - measurePoints[0][1]
          ) * METERS_PER_UNIT
        ).toFixed(2)
      : null;

  /* ---- Left panel tab content ---- */
  const renderPanelContent = () => {
    switch (leftTab) {
      case 'rooms':
        return (
          <div className="p-4 space-y-3">
            <p className="text-xs text-slate-500 mb-3">
              Types de pièces disponibles — cliquez pour ajouter sur l'étage actuel.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ROOM_TYPES.map((rt) => (
                <button
                  key={rt.name}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#2B4C7E] hover:shadow-sm transition text-left"
                >
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ background: rt.color, border: '1px solid rgba(0,0,0,0.1)' }}
                  />
                  <span className="text-xs text-slate-700 font-medium truncate">{rt.name}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'walls':
        return (
          <div className="p-4 space-y-5">
            {/* Scope selector */}
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Appliquer à
              </span>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                {(['floor', 'wall', 'all'] as TextureScope[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setTextureScope(s)}
                    className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md transition ${
                      textureScope === s ? 'bg-white text-[#2B4C7E] shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {s === 'floor' ? 'Sol' : s === 'wall' ? 'Mur' : 'Tout'}
                  </button>
                ))}
              </div>
            </div>

            {/* Wall textures */}
            {(textureScope === 'wall' || textureScope === 'all') && (
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                  Texture mur
                </span>
                <div className="flex gap-6 justify-center">
                  <TextureSphere
                    material="brick"
                    selected={selectedWallMaterial === 'brick'}
                    onClick={() => applyMaterialToWallOrFloor('brick')}
                    label="Briques rouges"
                  />
                  <TextureSphere
                    material="concrete"
                    selected={selectedWallMaterial === 'concrete'}
                    onClick={() => applyMaterialToWallOrFloor('concrete')}
                    label="Ciment / béton"
                  />
                </div>
              </div>
            )}

            {/* Floor textures */}
            {(textureScope === 'floor' || textureScope === 'all') && (
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                  Texture sol
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'oak', label: 'Parquet chêne' },
                      { id: 'tile', label: 'Carrelage blanc' },
                      { id: 'concrete', label: 'Béton ciré' },
                      { id: 'marble', label: 'Marbre' },
                    ] as { id: FloorMaterial; label: string }[]
                  ).map((ft) => (
                    <FloorTextureCard
                      key={ft.id}
                      id={ft.id}
                      label={ft.label}
                      selected={selectedFloorMaterial === ft.id}
                      onClick={() => setSelectedFloorMaterial(ft.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            <p className="text-[11px] text-slate-400">
              {selectedWallId
                ? 'Appliqué au mur sélectionné.'
                : `Appliqué à tous les murs du ${getFloorLabel(currentFloor)}.`}
            </p>
          </div>
        );

      case 'textures':
        return (
          <div className="p-4 space-y-4">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Outil actif
            </span>

            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Mode</span>
                <span className="font-semibold text-slate-800">
                  {tool === 'select'
                    ? 'Sélection'
                    : tool === 'measure'
                    ? 'Règle'
                    : tool === 'paintWall'
                    ? 'Peinture mur'
                    : 'Placement'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Étage</span>
                <span className="font-semibold text-slate-800">{getFloorLabel(currentFloor)}</span>
              </div>
              {selectedWallId && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Mur</span>
                  <span className="font-mono text-[10px] text-blue-600">{selectedWallId}</span>
                </div>
              )}
              {selectedFurnitureId && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Meuble</span>
                  <button
                    onClick={removeSelectedFurniture}
                    className="text-red-500 hover:text-red-700 text-[11px] font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>

            {/* Tool quick-select */}
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Changer d'outil
              </span>
              <div className="grid grid-cols-3 gap-2">
                <ToolChip
                  active={tool === 'select'}
                  icon={<Square size={14} />}
                  label="Sélection"
                  onClick={() => { setTool('select'); setPendingCatalogId(null); }}
                />
                <ToolChip
                  active={tool === 'paintWall'}
                  icon={<Paintbrush size={14} />}
                  label="Peinture"
                  onClick={() => { setTool('paintWall'); setPendingCatalogId(null); }}
                />
                <ToolChip
                  active={tool === 'measure'}
                  icon={<Ruler size={14} />}
                  label="Règle"
                  onClick={() => { setTool('measure'); setPendingCatalogId(null); }}
                />
              </div>
            </div>

            {measurePoints.length > 0 && (
              <button
                onClick={() => setMeasurePoints([])}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Effacer la mesure
              </button>
            )}
          </div>
        );

      case 'furniture':
        return (
          <div className="p-4 space-y-2">
            <p className="text-xs text-slate-500 mb-3">Ajoutez des meubles au panier, puis placez-les.</p>
            {FURNITURE_CATALOG.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  {/* 3D shape preview instead of emoji */}
                  <FurnitureIcon type={item.type} color={item.color} />
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{item.name}</p>
                    <p className="text-[11px] text-slate-400">{item.price} EUR</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold"
                  >
                    −
                  </button>
                  <span className="text-xs font-bold w-5 text-center text-slate-700">{cart[item.id] ?? 0}</span>
                  <button
                    onClick={() => addToCart(item.id)}
                    className="w-7 h-7 rounded-lg bg-[#2B4C7E] hover:bg-[#1E355A] text-white text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  const LEFT_TABS: { id: LeftPanelTab; label: string; icon: React.ReactNode }[] = [
    { id: 'rooms', label: 'Pièces', icon: <LayoutGrid size={15} /> },
    { id: 'walls', label: 'Murs', icon: <Wallpaper size={15} /> },
    { id: 'textures', label: 'Textures', icon: <Palette size={15} /> },
    { id: 'furniture', label: 'Meubles', icon: <Sofa size={15} /> },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#F8FAFC] text-slate-700">
      {/* Workspace */}
      {viewMode === '2D' ? (
        <div className="absolute inset-0" style={dotGridStyle()}>
          <Canvas2DWorkspace
            property={selectedProperty}
            currentFloor={currentFloor}
            selectedWallId={selectedWallId}
            selectedFurnitureId={selectedFurnitureId}
            selectedTool={tool}
            selectedMaterial={selectedWallMaterial}
            measurePoints={measurePoints}
            onHit={handleWorkspaceHit}
          />
        </div>
      ) : (
        <ThreeWorkspace
          property={selectedProperty}
          currentFloor={currentFloor}
          showAllFloors={showAllFloors}
          selectedWallId={selectedWallId}
          selectedFurnitureId={selectedFurnitureId}
          measurePoints={measurePoints}
          onHit={handleWorkspaceHit}
        />
      )}

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between z-40 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold tracking-wide cursor-pointer">
            <div className="flex items-center gap-8">
              <Link to={buildPath("/", { country: "france" })}>
                <img width={90} src="/images/Logo_blanc.png" alt="Logo Colibi" />
              </Link>
            </div>
            <span className="text-[#2B4C7E] text-sm border-l border-slate-200 pl-2">W-ArtHome</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowHomeMenu((v) => !v)}
              className="flex items-center gap-2 hover:bg-slate-100 px-3 py-2 rounded-lg transition text-sm font-medium text-slate-700"
            >
              <Home size={18} className="text-slate-500" />
              <span>{selectedProperty.name}</span>
            </button>

            {showHomeMenu && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                <button
                  onClick={() => {
                    const n = prompt('Renommer le bien :', selectedProperty.name);
                    if (n) updateSelectedProperty((draft) => { draft.name = n; });
                    setShowHomeMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Renommer
                </button>
                <button
                  onClick={() => { alert('Bien sauvegardé !'); setShowHomeMenu(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => { setShowInfoModal(true); setShowHomeMenu(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Infos sur ce bien
                </button>
                <hr className="my-1 border-slate-100" />
                <button
                  onClick={() => { setShowMyProperties(true); setShowHomeMenu(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs text-[#2B4C7E] hover:bg-slate-50 font-medium"
                >
                  Voir mes biens
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowFloorOptions((v) => !v)}
            className="flex items-center gap-2 hover:bg-slate-100 px-3 py-2 rounded-lg transition text-sm font-medium"
          >
            <Layers size={18} className="text-slate-500" />
            <span className="text-xs">Étages</span>
          </button>

          <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
            <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition">
              <Undo2 size={16} />
            </button>
            <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition">
              <Redo2 size={16} />
            </button>
          </div>
        </div>

        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 shadow-inner">
          <button
            onClick={() => setViewMode('2D')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              viewMode === '2D' ? 'bg-[#2B4C7E] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2D
          </button>
          <button
            onClick={() => setViewMode('3D')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              viewMode === '3D' ? 'bg-[#2B4C7E] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3D
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition">
            <Settings size={20} />
          </button>
          <button
            onClick={() => setShowCart(true)}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition relative"
          >
            <ShoppingBag size={20} />
            {cartLines.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
            )}
          </button>
          <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition">
            <User size={20} />
          </button>
        </div>
      </header>

      {/* Placement / measure banner */}
      {(pendingCatalogId || measuredDistance) && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex gap-3">
          {pendingCatalogId && (
            <div className="px-4 py-2 bg-white/95 backdrop-blur-md rounded-xl shadow border text-xs">
              Placement : <strong>{getCatalogItem(pendingCatalogId).name}</strong>
            </div>
          )}
          {measuredDistance && (
            <div className="px-4 py-2 bg-[#2B4C7E] text-white rounded-xl shadow text-xs">
              Distance : <strong>{measuredDistance} m</strong>
            </div>
          )}
        </div>
      )}

      {/* Left panel — redesigned with 4 tabs */}
      <div
        className={`absolute top-20 left-4 bottom-4 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 transition-all duration-300 flex flex-col ${
          showLeftPanel ? 'translate-x-0' : '-translate-x-[calc(100%+20px)]'
        }`}
      >
        {/* Tab bar */}
        <div className="flex border-b border-slate-100 px-2 pt-2 gap-1 shrink-0">
          {LEFT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setLeftTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-t-xl text-[10px] font-semibold transition ${
                leftTab === tab.id
                  ? 'bg-[#EEF4FF] text-[#2B4C7E] border-b-2 border-[#2B4C7E]'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">{renderPanelContent()}</div>

        {/* Footer reset */}
        <div className="px-4 pb-4 pt-2 border-t border-slate-100 shrink-0">
          <button
            className="w-full py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-medium text-slate-500 transition"
            onClick={() => {
              setTool('select');
              setPendingCatalogId(null);
              setMeasurePoints([]);
            }}
          >
            Réinitialiser l'outil
          </button>
        </div>
      </div>

      {/* Toggle panel */}
      <button
        onClick={() => setShowLeftPanel((v) => !v)}
        className="absolute top-1/2 -translate-y-1/2 bg-[#2B4C7E] text-white px-1 py-6 rounded-r-xl shadow-lg z-30 hover:bg-[#1E355A] transition"
        style={{ left: showLeftPanel ? '302px' : '0px', transition: 'left 0.3s ease' }}
      >
        {showLeftPanel ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Welcome tooltip */}
      {showWelcomeTooltip && viewMode === '2D' && !showLeftPanel && (
        <div className="absolute top-1/2 -translate-y-1/2 left-12 bg-[#2B4C7E] text-white p-4 rounded-2xl shadow-2xl z-30 max-w-[240px]">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-xs font-bold">Dessinez votre plan 2D</h4>
            <button onClick={() => setShowWelcomeTooltip(false)} className="text-white/70 hover:text-white ml-2">
              <X size={14} />
            </button>
          </div>
          <p className="text-[11px] text-white/80 leading-relaxed">
            Ouvrez le volet gauche pour modifier les murs, mesurer ou placer des meubles.
          </p>
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-[#2B4C7E] border-b-8 border-b-transparent" />
        </div>
      )}

      {/* Right controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-30 items-center">
        <div className="bg-white rounded-2xl shadow-lg p-2 border border-slate-200 flex flex-col gap-2">
          <IconButton
            active={tool === 'measure'}
            onClick={() => { setTool('measure'); setPendingCatalogId(null); }}
            title="Règle"
          >
            <Ruler size={18} />
          </IconButton>
          <IconButton
            active={tool === 'select'}
            onClick={() => { setTool('select'); setPendingCatalogId(null); }}
            title="Sélection"
          >
            <TargetIcon />
          </IconButton>
          <IconButton onClick={() => setShowCart(true)} title="Panier">
            <ShoppingBag size={18} />
          </IconButton>
          <IconButton active={showFloorOptions} onClick={() => setShowFloorOptions((v) => !v)} title="Étages">
            <FloorStackIcon />
          </IconButton>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-2 border border-slate-200 flex flex-col items-center w-14">
          <button
            onClick={() => setCurrentFloor(1)}
            className={`p-1.5 rounded-lg transition ${
              currentFloor === 1 ? 'text-[#2B4C7E] bg-blue-50 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ArrowUp size={16} />
          </button>
          <span className="text-xs font-bold my-1 text-slate-700">{currentFloor === 1 ? '1' : '0'}</span>
          <button
            onClick={() => setCurrentFloor(0)}
            className={`p-1.5 rounded-lg transition ${
              currentFloor === 0 ? 'text-[#2B4C7E] bg-blue-50 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ArrowDown size={16} />
          </button>
          <hr className="w-full my-1 border-slate-100" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
            {getFloorLabel(currentFloor)}
          </span>
        </div>
      </div>

      {/* Floor options */}
      {showFloorOptions && (
        <div className="absolute bottom-32 right-24 w-72 bg-[#efefef]/95 backdrop-blur-md border border-slate-200 rounded-[28px] shadow-2xl p-5 z-40">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-semibold text-[#3F5E90]">Aperçu des étages</h3>
            <button onClick={() => setShowFloorOptions(false)} className="text-[#3F5E90] hover:text-slate-700">
              <X size={22} />
            </button>
          </div>
          <div className="space-y-4 mb-5">
            <ToggleRow
              label="Afficher uniquement l'étage actuel"
              checked={onlyShowCurrentFloor}
              onToggle={() => {
                const next = !onlyShowCurrentFloor;
                setOnlyShowCurrentFloor(next);
                if (next) setShowAllFloors(false);
              }}
            />
            <ToggleRow
              label="Afficher tous les étages"
              checked={showAllFloors}
              onToggle={() => {
                const next = !showAllFloors;
                setShowAllFloors(next);
                if (next) setOnlyShowCurrentFloor(false);
              }}
            />
          </div>
          <div className="bg-white rounded-2xl p-3 space-y-2 min-h-[120px]">
            {([0, 1] as FloorId[]).map((f) => (
              <button
                key={f}
                onClick={() => setCurrentFloor(f)}
                className={`w-full flex items-center gap-3 text-left px-2 py-2 rounded-xl text-xs ${
                  currentFloor === f ? 'bg-slate-50 text-[#2B4C7E]' : 'text-slate-500'
                }`}
              >
                <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                  {currentFloor === f && <span className="w-2.5 h-2.5 rounded-full bg-[#4f78ff]" />}
                </span>
                {getFloorLabel(f)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cart */}
      {showCart && (
        <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[520px] rounded-[30px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-8 py-6 flex justify-between items-center">
              <div className="flex items-center gap-3 text-[#3F5E90]">
                <ShoppingBag size={24} />
                <h3 className="text-2xl font-semibold">Panier meubles</h3>
              </div>
              <button onClick={() => setShowCart(false)} className="text-[#3F5E90]">
                <X size={28} />
              </button>
            </div>
            <div className="px-8">
              <div className="h-[2px] bg-[#3F5E90] rounded-full mb-6" />
            </div>
            <div className="px-8 flex-1 overflow-y-auto">
              <div className="space-y-2">
                {FURNITURE_CATALOG.map((item) => {
                  const qty = cart[item.id] ?? 0;
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[32px_1fr_80px_40px_80px_80px] items-center gap-2 bg-slate-50 rounded-xl px-3 py-3 border border-slate-100"
                    >
                      <input type="checkbox" checked={qty > 0} readOnly className="w-4 h-4 accent-[#2B4C7E]" />
                      <div className="flex items-center gap-2 min-w-0">
                        <FurnitureIcon type={item.type} color={item.color} small />
                        <span className="text-sm text-slate-700 truncate">{item.name}</span>
                      </div>
                      <span className="text-xs text-slate-500">{item.price} EUR</span>
                      <span className="text-xs text-slate-500">x{qty}</span>
                      <span className="text-xs font-semibold text-slate-800">{item.price * qty} EUR</span>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold">−</button>
                        <button onClick={() => addToCart(item.id)} className="w-7 h-7 rounded-lg bg-[#2B4C7E] hover:bg-[#1E355A] text-white font-bold">+</button>
                      </div>
                      {qty > 0 && (
                        <div className="col-span-6 flex justify-end pt-1">
                          <button
                            onClick={() => beginPlacement(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#2B4C7E] text-xs font-medium hover:bg-blue-100"
                          >
                            Placer dans la scène
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="px-8 py-6 space-y-3 text-right text-slate-500">
              <div className="text-xs">
                Quantité totale : <strong>{cartLines.reduce((a, i) => a + (cart[i.id] ?? 0), 0)}</strong>
              </div>
              <button className="w-full py-4 bg-[#4B679C] hover:bg-[#3F5E90] text-white text-xl font-bold rounded-[20px] transition">
                Total : {totalCartPrice} EUR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property info */}
      {showInfoModal && (
        <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-[28px] shadow-2xl p-6 relative">
            <button onClick={() => setShowInfoModal(false)} className="absolute top-4 right-4 text-[#3F5E90]">
              <X size={20} />
            </button>
            <div className="bg-[#2B4C7E] text-white py-3 px-5 rounded-2xl text-sm font-semibold inline-block mb-5">
              Informations sur le bien
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <InfoRow label="Nom" value={selectedProperty.name} />
              <InfoRow label="Étages" value={String(selectedProperty.floorsCount)} />
              <InfoRow label="Pièces" value={String(selectedProperty.rooms.length)} />
              <InfoRow label="Surface totale" value={`${totalSurface.toFixed(2)} m²`} />
              <InfoRow label="Meubles placés" value={String(selectedProperty.furnitures.length)} />
            </div>
          </div>
        </div>
      )}

      {/* My properties */}
      {showMyProperties && (
        <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#efefef] w-[980px] rounded-[28px] shadow-2xl overflow-hidden max-h-[88vh] flex flex-col relative">
            <button
              onClick={() => setShowMyProperties(false)}
              className="absolute top-4 right-4 p-1 bg-white/80 rounded-full text-slate-500 z-10"
            >
              <X size={18} />
            </button>
            <div
              className="relative h-44 flex items-end p-8"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1000&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-slate-900/45" />
              <h2 className="relative text-white font-black text-2xl uppercase tracking-wide">
                Mes biens — W-Art Home
              </h2>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className={`bg-white border rounded-2xl p-4 grid grid-cols-[300px_1fr_220px] gap-5 ${
                    property.id === selectedPropertyId ? 'border-[#2B4C7E]' : 'border-slate-200'
                  }`}
                >
                  <div className="h-44 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                    <MiniPropertyPreview3D property={property} />
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p><strong className="text-slate-800">Nom :</strong> {property.name}</p>
                    <p><strong>Créé le :</strong> {property.createdAt}</p>
                    <p><strong>Modifié le :</strong> {property.updatedAt}</p>
                    <p><strong>Étages :</strong> {property.floorsCount}</p>
                    <p><strong>Pièces :</strong> {property.rooms.length}</p>
                    <p><strong>Surface :</strong> {getSurfaceForProperty(property).toFixed(2)} m²</p>
                    <p className="font-mono text-xs text-blue-500 mt-2">{property.id}.json</p>
                  </div>
                  <div className="flex flex-col justify-end items-end">
                    <button
                      onClick={() => { setSelectedPropertyId(property.id); setShowMyProperties(false); }}
                      className="px-6 py-3 bg-[#2B4C7E] hover:bg-[#1E355A] text-white font-bold text-sm rounded-xl transition shadow-md w-full"
                    >
                      Charger
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   FURNITURE ICON — SVG mini-shape instead of emoji
============================================================================ */

function FurnitureIcon({
  type,
  color,
  small,
}: {
  type: FurnitureCatalogItem['type'];
  color: string;
  small?: boolean;
}) {
  const size = small ? 28 : 36;
  return (
    <div
      className="rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: color + '22', border: `1px solid ${color}44` }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
        {type === 'sofa' && (
          <>
            <rect x="2" y="11" width="20" height="8" rx="3" fill={color} />
            <rect x="4" y="8" width="4" height="5" rx="1.5" fill={color} opacity="0.8" />
            <rect x="16" y="8" width="4" height="5" rx="1.5" fill={color} opacity="0.8" />
            <rect x="2" y="17" width="2.5" height="3" rx="1" fill={color} opacity="0.6" />
            <rect x="19.5" y="17" width="2.5" height="3" rx="1" fill={color} opacity="0.6" />
          </>
        )}
        {type === 'bed' && (
          <>
            <rect x="2" y="10" width="20" height="10" rx="2" fill={color} />
            <rect x="2" y="7" width="5" height="5" rx="1.5" fill={color} opacity="0.7" />
            <rect x="17" y="7" width="5" height="5" rx="1.5" fill={color} opacity="0.7" />
            <rect x="2" y="18" width="2" height="3" rx="1" fill={color} opacity="0.5" />
            <rect x="20" y="18" width="2" height="3" rx="1" fill={color} opacity="0.5" />
          </>
        )}
        {type === 'plant' && (
          <>
            <ellipse cx="12" cy="8" rx="5" ry="6" fill={color} />
            <rect x="10" y="13" width="4" height="7" rx="1.5" fill={color} opacity="0.6" />
            <ellipse cx="12" cy="20" rx="4" ry="1.5" fill={color} opacity="0.4" />
          </>
        )}
        {type === 'table' && (
          <>
            <rect x="2" y="10" width="20" height="3" rx="1.5" fill={color} />
            <rect x="4" y="13" width="2" height="7" rx="1" fill={color} opacity="0.6" />
            <rect x="18" y="13" width="2" height="7" rx="1" fill={color} opacity="0.6" />
          </>
        )}
      </svg>
    </div>
  );
}

/* ============================================================================
   2D WORKSPACE — no furniture icons (dots only), cleaner walls
============================================================================ */

function Canvas2DWorkspace({
  property,
  currentFloor,
  selectedWallId,
  selectedFurnitureId,
  selectedTool,
  selectedMaterial,
  measurePoints,
  onHit,
}: {
  property: PropertyModel;
  currentFloor: FloorId;
  selectedWallId: string | null;
  selectedFurnitureId: string | null;
  selectedTool: ToolMode;
  selectedMaterial: WallMaterial;
  measurePoints: [number, number][];
  onHit: (hit: WorkspaceHit) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverPoint, setHoverPoint] = useState<[number, number] | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const parent = canvas.parentElement!;
    const SCALE = 62;

    const resize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      draw();
    };

    const visibleRooms = property.rooms.filter((r) => r.floorId === currentFloor);
    const visibleWalls = property.walls.filter((w) => w.floorId === currentFloor);
    const visibleFurniture = property.furnitures.filter((f) => f.floorId === currentFloor);

    const worldToScreen = (x: number, z: number) => [
      canvas.width / 2 + x * SCALE,
      canvas.height / 2 + z * SCALE,
    ];

    const screenToWorld = (x: number, y: number): [number, number] => [
      (x - canvas.width / 2) / SCALE,
      (y - canvas.height / 2) / SCALE,
    ];

    const drawWall = (wall: WallModel) => {
      const [sx, sy] = worldToScreen(wall.start[0], wall.start[1]);
      const [ex, ey] = worldToScreen(wall.end[0], wall.end[1]);
      const isSelected = selectedWallId === wall.id;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Shadow/selection glow
      if (isSelected) {
        ctx.shadowColor = '#2B4C7E';
        ctx.shadowBlur = 8;
      }

      if (wall.material === 'brick') {
        ctx.strokeStyle = isSelected ? '#7c2d12' : '#9A3412';
        ctx.lineWidth = isSelected ? 13 : 10;
      } else {
        ctx.strokeStyle = isSelected ? '#475569' : '#64748b';
        ctx.lineWidth = isSelected ? 13 : 10;
      }

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Highlight stripe
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      // Material tick marks for brick
      if (wall.material === 'brick') {
        const len = Math.hypot(ex - sx, ey - sy);
        const ux = (ex - sx) / len;
        const uy = (ey - sy) / len;
        const nx = -uy, ny = ux;
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
        for (let d = 16; d < len; d += 24) {
          ctx.beginPath();
          ctx.moveTo(sx + ux * d + nx * 3, sy + uy * d + ny * 3);
          ctx.lineTo(sx + ux * d - nx * 3, sy + uy * d - ny * 3);
          ctx.stroke();
        }
      }

      if (isSelected) {
        ctx.strokeStyle = '#2B4C7E';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Rooms — light fills with labels (NO furniture in 2D)
      visibleRooms.forEach((room) => {
        const [x, y] = worldToScreen(room.x, room.z);
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillRect(x, y, room.w * SCALE, room.h * SCALE);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(room.name, x + (room.w * SCALE) / 2, y + (room.h * SCALE) / 2);
      });

      // Walls
      visibleWalls.forEach(drawWall);

      // Dimension rulers along rooms (optional readability aid)
      visibleRooms.forEach((room) => {
        const [x, y] = worldToScreen(room.x, room.z);
        const rw = room.w * SCALE;
        const rh = room.h * SCALE;

        ctx.save();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#64748b';
        ctx.font = '9px system-ui, sans-serif';
        ctx.textAlign = 'center';

        // Width ruler below
        ctx.beginPath();
        ctx.moveTo(x + 6, y + rh + 10);
        ctx.lineTo(x + rw - 6, y + rh + 10);
        ctx.stroke();
        ctx.fillText(`${(room.w * METERS_PER_UNIT).toFixed(1)} m`, x + rw / 2, y + rh + 20);

        ctx.restore();
      });

      // Furniture as simple labeled dots (no emoji)
      visibleFurniture.forEach((item) => {
        const catalog = getCatalogItem(item.catalogId);
        const [x, y] = worldToScreen(item.x, item.z);
        const isSelected = selectedFurnitureId === item.id;

        ctx.save();

        if (isSelected) {
          ctx.shadowColor = '#2B4C7E';
          ctx.shadowBlur = 6;
        }

        ctx.beginPath();
        ctx.fillStyle = isSelected ? '#dbeafe' : `${catalog.color}22`;
        ctx.strokeStyle = isSelected ? '#2B4C7E' : catalog.color;
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.roundRect(x - 14, y - 14, 28, 28, 6);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Small colored dot
        ctx.beginPath();
        ctx.fillStyle = catalog.color;
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Name label
        ctx.fillStyle = '#475569';
        ctx.font = '8px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(catalog.name.split(' ')[0], x, y + 20);

        ctx.restore();
      });

      // Furniture placement preview
      if (hoverPoint && selectedTool === 'placeFurniture') {
        const [hx, hy] = worldToScreen(hoverPoint[0], hoverPoint[1]);
        ctx.save();
        ctx.strokeStyle = '#2B4C7E';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1.5;
        ctx.strokeRect(hx - 16, hy - 16, 32, 32);
        ctx.restore();
      }

      // Measure line
      if (measurePoints.length >= 1) {
        const [x1, y1] = worldToScreen(measurePoints[0][0], measurePoints[0][1]);
        const x2y2 =
          measurePoints.length === 2
            ? worldToScreen(measurePoints[1][0], measurePoints[1][1])
            : hoverPoint
            ? worldToScreen(hoverPoint[0], hoverPoint[1])
            : [x1, y1];

        ctx.save();
        ctx.strokeStyle = '#2B4C7E';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 5]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2y2[0], x2y2[1]);
        ctx.stroke();

        // Endpoint dots
        ctx.setLineDash([]);
        ctx.fillStyle = '#2B4C7E';
        ctx.beginPath();
        ctx.arc(x1, y1, 4, 0, Math.PI * 2);
        ctx.fill();
        if (measurePoints.length === 2) {
          ctx.beginPath();
          ctx.arc(x2y2[0], x2y2[1], 4, 0, Math.PI * 2);
          ctx.fill();
        }

        const d = Math.hypot((x2y2[0] - x1) / SCALE, (x2y2[1] - y1) / SCALE);
        const labelX = (x1 + x2y2[0]) / 2;
        const labelY = (y1 + x2y2[1]) / 2 - 12;

        ctx.fillStyle = '#2B4C7E';
        ctx.beginPath();
        ctx.roundRect(labelX - 32, labelY - 12, 64, 20, 8);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(`${(d * METERS_PER_UNIT).toFixed(2)} m`, labelX, labelY + 2);
        ctx.restore();
      }

      // Material badge — bottom left
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.beginPath();
      ctx.roundRect(16, canvas.height - 52, 160, 30, 10);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#475569';
      ctx.font = '11px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(
        `Mur : ${selectedMaterial === 'brick' ? 'Brique' : 'Ciment'}`,
        28,
        canvas.height - 33
      );
      ctx.restore();
    };

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const p = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
      setHoverPoint([Math.round(p[0] * 2) / 2, Math.round(p[1] * 2) / 2]);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const point = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
      const hitFurniture = visibleFurniture.find((f) => Math.hypot(f.x - point[0], f.z - point[1]) < 0.4);
      const hitWall =
        visibleWalls.find(
          (w) => distancePointToSegment(point[0], point[1], w.start[0], w.start[1], w.end[0], w.end[1]) < 0.22
        )?.id ?? null;

      onHit({
        point: [Math.round(point[0] * 2) / 2, Math.round(point[1] * 2) / 2],
        wallId: hitWall,
        furnitureId: hitFurniture?.id ?? null,
      });
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('click', handleClick);

    const raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [
    property, currentFloor, selectedWallId, selectedFurnitureId,
    selectedTool, selectedMaterial, measurePoints, hoverPoint, onHit,
  ]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ============================================================================
   3D WORKSPACE — proper mesh furniture, no emoji
============================================================================ */

function ThreeWorkspace({
  property,
  currentFloor,
  showAllFloors,
  selectedWallId,
  selectedFurnitureId,
  measurePoints,
  onHit,
}: {
  property: PropertyModel;
  currentFloor: FloorId;
  showAllFloors: boolean;
  selectedWallId: string | null;
  selectedFurnitureId: string | null;
  measurePoints: [number, number][];
  onHit: (hit: WorkspaceHit) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf4f7fb);

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffffff, 1.3);
    sun.position.set(12, 20, 8);
    sun.castShadow = true;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xc8d8f0, 0.5);
    fill.position.set(-8, 10, -6);
    scene.add(fill);

    const roomGroup = new THREE.Group();
    const wallGroup = new THREE.Group();
    const furnGroup = new THREE.Group();
    const helperGroup = new THREE.Group();
    scene.add(roomGroup, wallGroup, furnGroup, helperGroup);

    const brickTexture = createWallTexture('brick');
    const concreteTexture = createWallTexture('concrete');

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.userData.kind = 'ground';
    scene.add(ground);

    const grid = new THREE.GridHelper(100, 100, 0xd0dcee, 0xe8eef8);
    scene.add(grid);

    const clearGroup = (g: THREE.Group) => { while (g.children.length) g.remove(g.children[0]); };

    /** Build a realistic sofa mesh */
    const makeSofaMesh = (color: string, selected: boolean) => {
      const group = new THREE.Group();
      const mat = (c: string, emissive = false) =>
        new THREE.MeshStandardMaterial({
          color: c,
          roughness: 0.75,
          metalness: 0.05,
          emissive: emissive ? new THREE.Color('#3b82f6') : new THREE.Color('#000'),
          emissiveIntensity: emissive ? 0.3 : 0,
        });

      // Seat
      const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.28, 0.85), mat(color, selected));
      seat.position.set(0, 0.14, 0);
      seat.castShadow = true;
      group.add(seat);

      // Back
      const back = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.55, 0.18), mat(color, selected));
      back.position.set(0, 0.55, -0.34);
      back.castShadow = true;
      group.add(back);

      // Armrests
      [-0.81, 0.81].forEach((x) => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.85), mat(color, selected));
        arm.position.set(x, 0.34, 0);
        arm.castShadow = true;
        group.add(arm);
      });

      // Legs
      [[-0.75, -0.38], [0.75, -0.38], [-0.75, 0.38], [0.75, 0.38]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 0.18, 8),
          new THREE.MeshStandardMaterial({ color: '#5a3e28', roughness: 0.6 })
        );
        leg.position.set(lx, -0.07, lz);
        group.add(leg);
      });

      return group;
    };

    const makeBedMesh = (color: string, selected: boolean) => {
      const group = new THREE.Group();
      const mat = (c: string) =>
        new THREE.MeshStandardMaterial({
          color: c, roughness: 0.7,
          emissive: selected ? new THREE.Color('#3b82f6') : new THREE.Color('#000'),
          emissiveIntensity: selected ? 0.25 : 0,
        });

      // Frame
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.2, 2.2), mat('#6b4c2e'));
      frame.position.set(0, 0.1, 0);
      frame.castShadow = true;
      group.add(frame);

      // Mattress
      const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.22, 1.9), mat(color));
      mattress.position.set(0, 0.31, 0.1);
      mattress.castShadow = true;
      group.add(mattress);

      // Pillow
      const pillow = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.1, 0.3), mat('#f1f5f9'));
      pillow.position.set(0, 0.47, -0.7);
      pillow.castShadow = true;
      group.add(pillow);

      // Headboard
      const head = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.55, 0.12), mat('#6b4c2e'));
      head.position.set(0, 0.38, -1.06);
      head.castShadow = true;
      group.add(head);

      return group;
    };

    const makePlantMesh = (color: string, selected: boolean) => {
      const group = new THREE.Group();
      const emissive = selected ? new THREE.Color('#3b82f6') : new THREE.Color('#000');
      const emissiveIntensity = selected ? 0.25 : 0;

      // Pot
      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.16, 0.3, 12),
        new THREE.MeshStandardMaterial({ color: '#c27b4f', roughness: 0.8, emissive, emissiveIntensity })
      );
      pot.position.set(0, 0.15, 0);
      pot.castShadow = true;
      group.add(pot);

      // Soil
      const soil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.19, 0.19, 0.04, 12),
        new THREE.MeshStandardMaterial({ color: '#4a3728', roughness: 1 })
      );
      soil.position.set(0, 0.32, 0);
      group.add(soil);

      // Foliage — stacked spheres
      const leafMat = new THREE.MeshStandardMaterial({ color, roughness: 0.85, emissive, emissiveIntensity });
      [[0, 0.75, 0, 0.32], [-0.15, 0.62, 0.1, 0.22], [0.18, 0.6, -0.08, 0.24], [0, 0.58, -0.14, 0.2]].forEach(
        ([lx, ly, lz, r]) => {
          const leaf = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), leafMat);
          leaf.position.set(lx, ly, lz);
          leaf.castShadow = true;
          group.add(leaf);
        }
      );

      return group;
    };

    const makeTableMesh = (color: string, selected: boolean) => {
      const group = new THREE.Group();
      const woodMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.6,
        emissive: selected ? new THREE.Color('#3b82f6') : new THREE.Color('#000'),
        emissiveIntensity: selected ? 0.25 : 0,
      });

      // Tabletop
      const top = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.07, 0.6), woodMat);
      top.position.set(0, 0.37, 0);
      top.castShadow = true;
      top.receiveShadow = true;
      group.add(top);

      // Legs
      [[-0.48, 0.25], [0.48, 0.25], [-0.48, -0.25], [0.48, -0.25]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8), woodMat);
        leg.position.set(lx, 0.175, lz);
        leg.castShadow = true;
        group.add(leg);
      });

      return group;
    };

    const makeFurnitureObject = (f: FurnitureInstance) => {
      const catalog = getCatalogItem(f.catalogId);
      const isSelected = selectedFurnitureId === f.id;
      const group = new THREE.Group();
      group.userData.kind = 'furniture';
      group.userData.id = f.id;

      let mesh: THREE.Group;
      if (catalog.type === 'sofa') mesh = makeSofaMesh(catalog.color, isSelected);
      else if (catalog.type === 'bed') mesh = makeBedMesh(catalog.color, isSelected);
      else if (catalog.type === 'plant') mesh = makePlantMesh(catalog.color, isSelected);
      else mesh = makeTableMesh(catalog.color, isSelected);

      group.add(mesh);
      return group;
    };

    const rebuild = () => {
      clearGroup(roomGroup); clearGroup(wallGroup); clearGroup(furnGroup); clearGroup(helperGroup);

      const visibleFloors: FloorId[] = showAllFloors ? [0, 1] : [currentFloor];

      visibleFloors.forEach((floorId) => {
        const elevation = floorId === 0 ? 0 : 3.2;
        const floorOpacity = showAllFloors && floorId !== currentFloor ? 0.4 : 1;

        property.rooms.filter((r) => r.floorId === floorId).forEach((room) => {
          const slab = new THREE.Mesh(
            new THREE.BoxGeometry(room.w, 0.08, room.h),
            new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: floorOpacity < 1, opacity: 0.98 * floorOpacity })
          );
          slab.position.set(room.x + room.w / 2, elevation + 0.04, room.z + room.h / 2);
          slab.receiveShadow = true;
          slab.userData.kind = 'ground';
          roomGroup.add(slab);
        });

        property.walls.filter((w) => w.floorId === floorId).forEach((wall) => {
          const dx = wall.end[0] - wall.start[0];
          const dz = wall.end[1] - wall.start[1];
          const length = Math.hypot(dx, dz);
          const material = new THREE.MeshStandardMaterial({
            map: wall.material === 'brick' ? brickTexture : concreteTexture,
            transparent: floorOpacity < 1,
            opacity: floorOpacity,
            emissive: selectedWallId === wall.id ? new THREE.Color('#1d4ed8') : new THREE.Color('#000'),
            emissiveIntensity: selectedWallId === wall.id ? 0.18 : 0,
          });
          const mesh = new THREE.Mesh(new THREE.BoxGeometry(length, 2.7, 0.18), material);
          mesh.position.set(
            (wall.start[0] + wall.end[0]) / 2, elevation + 1.35,
            (wall.start[1] + wall.end[1]) / 2
          );
          mesh.rotation.y = Math.atan2(dz, dx);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.userData.kind = 'wall';
          mesh.userData.id = wall.id;
          wallGroup.add(mesh);
        });

        property.furnitures.filter((f) => f.floorId === floorId).forEach((f) => {
          const obj = makeFurnitureObject(f);
          obj.position.set(f.x, elevation + 0.04, f.z);
          furnGroup.add(obj);
        });
      });

      if (measurePoints.length === 2) {
        const y = currentFloor === 0 ? 0.06 : 3.26;
        const pts = [
          new THREE.Vector3(measurePoints[0][0], y, measurePoints[0][1]),
          new THREE.Vector3(measurePoints[1][0], y, measurePoints[1][1]),
        ];
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineDashedMaterial({ color: 0x2b4c7e, dashSize: 0.3, gapSize: 0.16 })
        );
        line.computeLineDistances();
        helperGroup.add(line);
      }
    };

    rebuild();

    let radius = 14, theta = Math.PI / 4, phi = 1.05;
    const updateCamera = () => {
      camera.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(0, 1.5, 0);
    };
    updateCamera();

    let isDragging = false, lastX = 0, lastY = 0;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => { isDragging = true; lastX = e.clientX; lastY = e.clientY; };
    const handlePointerMove = (e: MouseEvent) => {
      if (!isDragging) return;
      theta -= (e.clientX - lastX) * 0.008;
      phi = Math.min(Math.PI - 0.35, Math.max(0.35, phi + (e.clientY - lastY) * 0.008));
      lastX = e.clientX; lastY = e.clientY;
      updateCamera();
    };
    const handlePointerUp = () => { isDragging = false; };
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      radius = Math.max(6, Math.min(26, radius + e.deltaY * 0.01));
      updateCamera();
    };
    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (!intersects.length) return;
      const obj = intersects[0].object;
      let node: THREE.Object3D | null = obj;
      while (node && !node.userData.kind) node = node.parent;
      const point: [number, number] = [
        Math.round(intersects[0].point.x * 2) / 2,
        Math.round(intersects[0].point.z * 2) / 2,
      ];
      if (node?.userData.kind === 'wall') { onHit({ point, wallId: node.userData.id, furnitureId: null }); return; }
      if (node?.userData.kind === 'furniture') { onHit({ point, wallId: null, furnitureId: node.userData.id }); return; }
      onHit({ point, wallId: null, furnitureId: null });
    };
    const resize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    renderer.domElement.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });
    renderer.domElement.addEventListener('click', handleClick);
    window.addEventListener('resize', resize);

    let frame = 0;
    const animate = () => { frame = requestAnimationFrame(animate); renderer.render(scene, camera); };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      renderer.domElement.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      renderer.domElement.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resize);
      brickTexture.dispose(); concreteTexture.dispose(); renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [property, currentFloor, showAllFloors, selectedWallId, selectedFurnitureId, measurePoints, onHit]);

  return <div ref={containerRef} className="absolute inset-0" />;
}

/* ============================================================================
   MINI 3D PREVIEW
============================================================================ */

function MiniPropertyPreview3D({ property }: { property: PropertyModel }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current!;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf4f7fb);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(8, 7, 8);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const light = new THREE.DirectionalLight(0xffffff, 0.9);
    light.position.set(8, 12, 8);
    scene.add(light);

    const brickTexture = createWallTexture('brick');
    const concreteTexture = createWallTexture('concrete');
    const roomGroup = new THREE.Group();
    const wallGroup = new THREE.Group();
    scene.add(roomGroup, wallGroup);

    property.rooms.forEach((room) => {
      const y = room.floorId === 0 ? 0.03 : 3.23;
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(room.w, 0.06, room.h),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      );
      slab.position.set(room.x + room.w / 2, y, room.z + room.h / 2);
      roomGroup.add(slab);
    });

    property.walls.forEach((wall) => {
      const dx = wall.end[0] - wall.start[0];
      const dz = wall.end[1] - wall.start[1];
      const len = Math.hypot(dx, dz);
      const y = wall.floorId === 0 ? 1.3 : 4.5;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(len, 2.5, 0.16),
        new THREE.MeshStandardMaterial({ map: wall.material === 'brick' ? brickTexture : concreteTexture })
      );
      mesh.position.set((wall.start[0] + wall.end[0]) / 2, y, (wall.start[1] + wall.end[1]) / 2);
      mesh.rotation.y = Math.atan2(dz, dx);
      wallGroup.add(mesh);
    });

    renderer.render(scene, camera);
    const resize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      brickTexture.dispose(); concreteTexture.dispose(); renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [property]);

  return <div ref={ref} className="w-full h-full" />;
}

/* ============================================================================
   SMALL UI COMPONENTS
============================================================================ */

function ToggleRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="w-full flex items-center justify-between text-left">
      <span className="text-xs text-slate-600">{label}</span>
      <div className={`w-8 h-5 rounded-full relative transition ${checked ? 'bg-[#44679D]' : 'bg-slate-300'}`}>
        <div className={`absolute top-[2px] w-4 h-4 bg-white rounded-full transition-all ${checked ? 'left-[14px]' : 'left-[2px]'}`} />
      </div>
    </button>
  );
}

function IconButton({
  children,
  active,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
        active ? 'bg-[#2B4C7E] text-white' : 'hover:bg-slate-100 text-[#3F5E90]'
      }`}
    >
      {children}
    </button>
  );
}

function ToolChip({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border transition text-[10px] font-semibold ${
        active
          ? 'bg-[#EEF4FF] border-[#2B4C7E] text-[#2B4C7E]'
          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-xs">{label}</span>
      <span className="font-semibold text-slate-800 text-sm">{value}</span>
    </div>
  );
}

function TargetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FloorStackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </svg>
  );
}