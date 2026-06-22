'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Home,
  Layers,
  Undo2,
  Redo2,
  Settings,
  ShoppingBag,
  User,
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
  SunMedium,
  Download,
  Share2,
  MoreHorizontal,
  Eye,
  CircleDot,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildPath } from "../shared/utils";
import * as THREE from 'three';

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
  { id: 'meuble-sofa', name: 'Canapé Oslo', price: 420, type: 'sofa', color: '#6b7280' },
  { id: 'meuble-plant', name: 'Pot Vert', price: 120, type: 'plant', color: '#65a30d' },
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
];

const ROOM_TYPES = [
  { name: 'Salon', color: '#2a2a2a' },
  { name: 'Chambre', color: '#3a2f2f' },
  { name: 'Cuisine', color: '#3b3428' },
  { name: 'Salle de bain', color: '#2e3b3f' },
  { name: 'Bureau', color: '#342f43' },
  { name: 'Couloir', color: '#2c2f33' },
  { name: 'Entrée', color: '#3c3428' },
  { name: 'Balcon', color: '#24342e' },
];

/* ============================================================================
   HELPERS
============================================================================ */

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
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

/* ============================================================================
   MAIN
============================================================================ */

export default function ColibiHomeDarkLuxury() {
  const [properties, setProperties] = useState<PropertyModel[]>(INITIAL_PROPERTIES);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(INITIAL_PROPERTIES[0].id);

  const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');
  const [currentFloor, setCurrentFloor] = useState<FloorId>(0);

  const [showHomeMenu, setShowHomeMenu] = useState(false);
  const [showFloorOptions, setShowFloorOptions] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showMyProperties, setShowMyProperties] = useState(false);

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
  const [leftTab, setLeftTab] = useState<LeftPanelTab>('walls');

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
      ? Math.hypot(
          measurePoints[1][0] - measurePoints[0][0],
          measurePoints[1][1] - measurePoints[0][1]
        ).toFixed(2)
      : null;

  const LEFT_TABS: { id: LeftPanelTab; label: string; icon: React.ReactNode }[] = [
    { id: 'rooms', label: 'Pièces', icon: <LayoutGrid size={15} /> },
    { id: 'walls', label: 'Murs', icon: <Wallpaper size={15} /> },
    { id: 'textures', label: 'Outils', icon: <Palette size={15} /> },
    { id: 'furniture', label: 'Meubles', icon: <Sofa size={15} /> },
  ];

  const renderPanelContent = () => {
    switch (leftTab) {
      case 'rooms':
        return (
          <div className="space-y-3">
            {ROOM_TYPES.map((rt) => (
              <button
                key={rt.name}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1e1e1e] border border-[#2b2b2b] hover:border-[#4867a8]/40 transition text-left"
              >
                <span
                  className="w-4 h-4 rounded-md border border-white/10"
                  style={{ background: rt.color }}
                />
                <span className="text-sm font-medium text-zinc-200">{rt.name}</span>
              </button>
            ))}
          </div>
        );

      case 'walls':
        return (
          <div className="space-y-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500 mb-3">Appliquer à</p>
              <div className="flex gap-2">
                {(['floor', 'wall', 'all'] as TextureScope[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setTextureScope(s)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                      textureScope === s
                        ? 'bg-[#4867a8] text-black border-[#4867a8]'
                        : 'bg-[#1a1a1a] text-zinc-400 border-[#2a2a2a] hover:text-white'
                    }`}
                  >
                    {s === 'floor' ? 'Sol' : s === 'wall' ? 'Mur' : 'Tout'}
                  </button>
                ))}
              </div>
            </div>

            {(textureScope === 'wall' || textureScope === 'all') && (
              <div>
                <PanelSectionTitle title="Wall materials" />
                <div className="grid grid-cols-2 gap-3">
                  <DarkMaterialCard
                    label="Brique"
                    subtitle="Texture chaude"
                    color="#8a4b32"
                    selected={selectedWallMaterial === 'brick'}
                    onClick={() => applyMaterialToWallOrFloor('brick')}
                  />
                  <DarkMaterialCard
                    label="Béton"
                    subtitle="Aspect minéral"
                    color="#70757e"
                    selected={selectedWallMaterial === 'concrete'}
                    onClick={() => applyMaterialToWallOrFloor('concrete')}
                  />
                </div>
              </div>
            )}

            {(textureScope === 'floor' || textureScope === 'all') && (
              <div>
                <PanelSectionTitle title="Floor materials" />
                <div className="grid grid-cols-2 gap-3">
                  <DarkFloorCard
                    label="Parquet"
                    type="oak"
                    selected={selectedFloorMaterial === 'oak'}
                    onClick={() => setSelectedFloorMaterial('oak')}
                  />
                  <DarkFloorCard
                    label="Carrelage"
                    type="tile"
                    selected={selectedFloorMaterial === 'tile'}
                    onClick={() => setSelectedFloorMaterial('tile')}
                  />
                  <DarkFloorCard
                    label="Béton ciré"
                    type="concrete"
                    selected={selectedFloorMaterial === 'concrete'}
                    onClick={() => setSelectedFloorMaterial('concrete')}
                  />
                  <DarkFloorCard
                    label="Marbre"
                    type="marble"
                    selected={selectedFloorMaterial === 'marble'}
                    onClick={() => setSelectedFloorMaterial('marble')}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 'textures':
        return (
          <div className="space-y-4">
            <PanelSectionTitle title="Outils de conception" />

            <div className="grid grid-cols-3 gap-2">
              <DarkToolButton
                active={tool === 'select'}
                icon={<Square size={14} />}
                label="Select"
                onClick={() => {
                  setTool('select');
                  setPendingCatalogId(null);
                }}
              />
              <DarkToolButton
                active={tool === 'paintWall'}
                icon={<Paintbrush size={14} />}
                label="Peindre"
                onClick={() => {
                  setTool('paintWall');
                  setPendingCatalogId(null);
                }}
              />
              <DarkToolButton
                active={tool === 'measure'}
                icon={<Ruler size={14} />}
                label="Règle"
                onClick={() => {
                  setTool('measure');
                  setPendingCatalogId(null);
                }}
              />
            </div>

            <div className="rounded-3xl border border-[#2b2b2b] bg-[#171717] p-4 space-y-3">
              <InfoLineDark label="Mode" value={
                tool === 'select'
                  ? 'Sélection'
                  : tool === 'measure'
                  ? 'Mesure'
                  : tool === 'paintWall'
                  ? 'Peinture'
                  : 'Placement'
              } />
              <InfoLineDark label="Étage" value={getFloorLabel(currentFloor)} />
              {selectedWallId && <InfoLineDark label="Mur" value={selectedWallId} />}
              {selectedFurnitureId && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Meuble</span>
                  <button
                    onClick={removeSelectedFurniture}
                    className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-300 text-[11px] font-semibold border border-red-500/20 hover:bg-red-500/15"
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>

            {measurePoints.length > 0 && (
              <button
                onClick={() => setMeasurePoints([])}
                className="w-full py-3 rounded-2xl bg-[#171717] border border-[#2b2b2b] text-sm text-zinc-300 hover:text-white transition"
              >
                Effacer la mesure
              </button>
            )}
          </div>
        );

      case 'furniture':
        return (
          <div className="space-y-3">
            {FURNITURE_CATALOG.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-[#171717] border border-[#2a2a2a] p-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FurnitureIconDark type={item.type} color={item.color} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-100 truncate">{item.name}</p>
                    <p className="text-xs text-zinc-500">{item.price} EUR</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 rounded-full bg-[#242424] border border-[#303030] text-zinc-300 hover:text-white"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-zinc-100">
                      {cart[item.id] ?? 0}
                    </span>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="w-8 h-8 rounded-full bg-[#4867a8] text-black font-bold hover:brightness-95"
                    >
                      +
                    </button>
                  </div>

                  {(cart[item.id] ?? 0) > 0 && (
                    <button
                      onClick={() => beginPlacement(item.id)}
                      className="px-3 py-2 rounded-full bg-[#242424] border border-[#363636] text-xs font-semibold text-zinc-200 hover:border-[#4867a8]/40"
                    >
                      Placer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0f0f10] text-white">
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

      {/* Top header */}
      <header className="absolute top-4 left-4 right-4 h-14 z-40 flex items-center justify-between rounded-[24px] border border-white/5 bg-black/70 backdrop-blur-xl px-4 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-4">
          <Link to={buildPath("/", { country: "france" })} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4867a8] text-black flex items-center justify-center font-black">
              C
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-white">W-ArtHome</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">3D models</p>
            </div>
          </Link>

          <div className="w-px h-6 bg-white/10" />

          <div className="relative">
            <button
              onClick={() => setShowHomeMenu((v) => !v)}
              className="flex items-center gap-2 text-sm text-zinc-200 hover:text-white transition"
            >
              <Home size={16} className="text-zinc-500" />
              <span>{selectedProperty.name}</span>
            </button>

            {showHomeMenu && (
              <div className="absolute top-full left-0 mt-3 w-56 rounded-3xl border border-[#2a2a2a] bg-[#141414] shadow-2xl overflow-hidden">
                <button
                  onClick={() => {
                    const n = prompt('Renommer le bien :', selectedProperty.name);
                    if (n) updateSelectedProperty((draft) => { draft.name = n; });
                    setShowHomeMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-[#1d1d1d]"
                >
                  Renommer
                </button>
                <button
                  onClick={() => {
                    setShowInfoModal(true);
                    setShowHomeMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-[#1d1d1d]"
                >
                  Infos du bien
                </button>
                <button
                  onClick={() => {
                    setShowMyProperties(true);
                    setShowHomeMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-[#4867a8] hover:bg-[#1d1d1d]"
                >
                  Voir mes biens
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#181818] rounded-full p-1 border border-[#2a2a2a]">
            <button
              onClick={() => setViewMode('2D')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                viewMode === '2D'
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              2D
            </button>
            <button
              onClick={() => setViewMode('3D')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                viewMode === '3D'
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              3D
            </button>
          </div>

          <button className="w-10 h-10 rounded-xl bg-[#181818] border border-[#2a2a2a] text-zinc-400 hover:text-white flex items-center justify-center">
            <Undo2 size={16} />
          </button>
          <button className="w-10 h-10 rounded-xl bg-[#181818] border border-[#2a2a2a] text-zinc-400 hover:text-white flex items-center justify-center">
            <Redo2 size={16} />
          </button>

          <button className="px-4 h-10 rounded-xl bg-[#4867a8] text-black text-xs font-bold flex items-center gap-2 hover:brightness-95">
            <Download size={15} />
            Sauvegarder
          </button>

          <button className="w-10 h-10 rounded-xl bg-[#181818] border border-[#2a2a2a] text-zinc-300 hover:text-white flex items-center justify-center">
            <Share2 size={16} />
          </button>
          <button className="w-10 h-10 rounded-xl bg-[#181818] border border-[#2a2a2a] text-zinc-300 hover:text-white flex items-center justify-center">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </header>

      {/* Left rail */}
      <div className="absolute top-24 left-4 bottom-4 w-[92px] z-30">
        <div className="h-full rounded-[28px] border border-white/5 bg-black/65 backdrop-blur-xl p-3 flex flex-col justify-between shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
          <div className="space-y-3">
            <DarkRailButton active={tool === 'select'} onClick={() => { setTool('select'); setPendingCatalogId(null); }}>
              <CircleDot size={18} />
            </DarkRailButton>
            <DarkRailButton active={tool === 'paintWall'} onClick={() => { setTool('paintWall'); setPendingCatalogId(null); }}>
              <Paintbrush size={18} />
            </DarkRailButton>
            <DarkRailButton active={tool === 'measure'} onClick={() => { setTool('measure'); setPendingCatalogId(null); }}>
              <Ruler size={18} />
            </DarkRailButton>
            <DarkRailButton onClick={() => setShowFloorOptions((v) => !v)} active={showFloorOptions}>
              <Layers size={18} />
            </DarkRailButton>
            <DarkRailButton onClick={() => setShowCart(true)}>
              <ShoppingBag size={18} />
            </DarkRailButton>
            <DarkRailButton>
              <SunMedium size={18} />
            </DarkRailButton>
          </div>

          <div className="rounded-[22px] bg-[#141414] border border-[#262626] p-2 flex flex-col items-center gap-1">
            <button
              onClick={() => setCurrentFloor(1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                currentFloor === 1 ? 'bg-[#4867a8] text-black' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <ArrowUp size={16} />
            </button>
            <span className="text-xl font-light text-zinc-200 leading-none">
              {currentFloor === 1 ? '1' : '0'}
            </span>
            <button
              onClick={() => setCurrentFloor(0)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                currentFloor === 0 ? 'bg-[#4867a8] text-black' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <ArrowDown size={16} />
            </button>
            <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 pt-1">
              {getFloorLabel(currentFloor)}
            </span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="absolute top-24 right-4 bottom-4 w-[360px] z-30">
        <div className="h-full rounded-[32px] border border-white/5 bg-black/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-zinc-300">
              <Eye size={16} className="text-[#4867a8]" />
              <span className="text-sm font-semibold">Design Panel</span>
            </div>
            <button className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-400 hover:text-white flex items-center justify-center">
              <Settings size={16} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-5">
            {LEFT_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setLeftTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 py-3 rounded-2xl border transition ${
                  leftTab === tab.id
                    ? 'bg-[#4867a8] text-black border-[#4867a8]'
                    : 'bg-[#171717] border-[#2a2a2a] text-zinc-400 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] font-bold">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {renderPanelContent()}
          </div>

          <div className="pt-4 mt-4 border-t border-white/5">
            <button
              onClick={() => {
                setTool('select');
                setPendingCatalogId(null);
                setMeasurePoints([]);
              }}
              className="w-full py-3 rounded-2xl bg-[#171717] border border-[#2a2a2a] text-sm text-zinc-300 hover:text-white transition"
            >
              Réinitialiser l’outil
            </button>
          </div>
        </div>
      </div>

      {/* Bottom center state */}
      {(pendingCatalogId || measuredDistance) && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-3">
          {pendingCatalogId && (
            <div className="px-5 py-3 rounded-full bg-[#4867a8] text-black text-xs font-bold shadow-xl">
              Placement : {getCatalogItem(pendingCatalogId).name}
            </div>
          )}
          {measuredDistance && (
            <div className="px-5 py-3 rounded-full bg-white text-black text-xs font-bold shadow-xl">
              Distance : {measuredDistance} m
            </div>
          )}
        </div>
      )}

      {/* Floor options */}
      {showFloorOptions && (
        <div className="absolute left-28 bottom-6 z-40 w-[320px] rounded-[30px] border border-[#2a2a2a] bg-[#111111]/95 backdrop-blur-xl p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white">Étages</h3>
            <button
              onClick={() => setShowFloorOptions(false)}
              className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-400 hover:text-white flex items-center justify-center"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <ToggleDark
              label="Afficher uniquement l’étage actuel"
              checked={onlyShowCurrentFloor}
              onToggle={() => {
                const next = !onlyShowCurrentFloor;
                setOnlyShowCurrentFloor(next);
                if (next) setShowAllFloors(false);
              }}
            />
            <ToggleDark
              label="Afficher tous les étages"
              checked={showAllFloors}
              onToggle={() => {
                const next = !showAllFloors;
                setShowAllFloors(next);
                if (next) setOnlyShowCurrentFloor(false);
              }}
            />
          </div>

          <div className="mt-5 space-y-2">
            {([0, 1] as FloorId[]).map((f) => (
              <button
                key={f}
                onClick={() => setCurrentFloor(f)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition ${
                  currentFloor === f
                    ? 'bg-[#4867a8] text-black border-[#4867a8]'
                    : 'bg-[#171717] text-zinc-300 border-[#2a2a2a]'
                }`}
              >
                <span className="text-sm font-semibold">{getFloorLabel(f)}</span>
                <span className="text-xs font-bold">{f}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cart modal */}
      {showCart && (
        <div className="absolute inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-[560px] max-h-[88vh] overflow-hidden rounded-[34px] border border-[#2a2a2a] bg-[#101010] shadow-2xl flex flex-col">
            <div className="px-7 py-6 flex items-center justify-between border-b border-white/5">
              <h3 className="text-xl font-bold text-white">Panier meubles</h3>
              <button
                onClick={() => setShowCart(false)}
                className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-400 hover:text-white flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-3">
              {FURNITURE_CATALOG.map((item) => {
                const qty = cart[item.id] ?? 0;
                return (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-[#171717] border border-[#2a2a2a] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <FurnitureIconDark type={item.type} color={item.color} />
                        <div>
                          <p className="text-sm font-semibold text-zinc-100">{item.name}</p>
                          <p className="text-xs text-zinc-500">{item.price} EUR / unité</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 rounded-full bg-[#242424] border border-[#303030] text-zinc-300"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-white">{qty}</span>
                        <button
                          onClick={() => addToCart(item.id)}
                          className="w-8 h-8 rounded-full bg-[#4867a8] text-black font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {qty > 0 && (
                      <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-sm text-zinc-400">
                          Total ligne : <strong className="text-white">{item.price * qty} EUR</strong>
                        </span>
                        <button
                          onClick={() => beginPlacement(item.id)}
                          className="px-4 py-2 rounded-full bg-[#4867a8] text-black text-xs font-bold"
                        >
                          Placer dans la scène
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="px-7 py-6 border-t border-white/5">
              <button className="w-full py-4 rounded-[20px] bg-[#4867a8] text-black text-lg font-black hover:brightness-95">
                Total : {totalCartPrice} EUR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property info modal */}
      {showInfoModal && (
        <div className="absolute inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-[440px] rounded-[30px] border border-[#2a2a2a] bg-[#111111] p-6 shadow-2xl relative">
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-400 hover:text-white flex items-center justify-center"
            >
              <X size={16} />
            </button>

            <div className="inline-flex px-4 py-2 rounded-full bg-[#4867a8] text-black text-xs font-black uppercase tracking-[0.15em] mb-5">
              Informations
            </div>

            <div className="space-y-3">
              <InfoLineDark label="Nom" value={selectedProperty.name} />
              <InfoLineDark label="Étages" value={String(selectedProperty.floorsCount)} />
              <InfoLineDark label="Pièces" value={String(selectedProperty.rooms.length)} />
              <InfoLineDark label="Surface totale" value={`${totalSurface.toFixed(2)} m²`} />
              <InfoLineDark label="Meubles placés" value={String(selectedProperty.furnitures.length)} />
            </div>
          </div>
        </div>
      )}

      {/* My properties */}
      {showMyProperties && (
        <div className="absolute inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-[980px] max-h-[88vh] overflow-hidden rounded-[34px] border border-[#2a2a2a] bg-[#0f0f10] shadow-2xl flex flex-col relative">
            <button
              onClick={() => setShowMyProperties(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-400 hover:text-white flex items-center justify-center"
            >
              <X size={18} />
            </button>

            <div className="h-44 relative flex items-end px-8 pb-8 border-b border-white/5 bg-[radial-gradient(circle_at_top_left,#3a2a0f_0%,#171717_55%,#0f0f10_100%)]">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#4867a8] mb-2">Portfolio</p>
                <h2 className="text-3xl font-black text-white">Mes biens — W-ArtHome</h2>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className={`rounded-[28px] border p-5 grid grid-cols-[1fr_220px] gap-5 ${
                    property.id === selectedPropertyId
                      ? 'bg-[#151515] border-[#4867a8]/40'
                      : 'bg-[#131313] border-[#242424]'
                  }`}
                >
                  <div>
                    <p className="text-lg font-bold text-white mb-2">{property.name}</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <PropertyStatDark label="Créé le" value={property.createdAt} />
                      <PropertyStatDark label="Modifié le" value={property.updatedAt} />
                      <PropertyStatDark label="Étages" value={String(property.floorsCount)} />
                      <PropertyStatDark label="Pièces" value={String(property.rooms.length)} />
                      <PropertyStatDark label="Surface" value={`${getSurfaceForProperty(property).toFixed(2)} m²`} />
                      <PropertyStatDark label="Fichier" value={`${property.id}.json`} />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSelectedPropertyId(property.id);
                        setShowMyProperties(false);
                      }}
                      className="w-full py-4 rounded-2xl bg-[#4867a8] text-black font-black hover:brightness-95"
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
   COMPONENTS
============================================================================ */

function WorkspacePlaceholderDark({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="w-28 h-28 mx-auto rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-md mb-6 flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-[#4867a8]" />
        </div>
        <p className="text-2xl font-black text-white">{title}</p>
        <p className="text-sm text-zinc-500 mt-2">{subtitle}</p>
      </div>
    </div>
  );
}

function PanelSectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-3">
      <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">{title}</p>
    </div>
  );
}

function DarkMaterialCard({
  label,
  subtitle,
  color,
  selected,
  onClick,
}: {
  label: string;
  subtitle: string;
  color: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-3xl border p-3 text-left transition ${
        selected
          ? 'bg-[#1b1b1b] border-[#4867a8] shadow-[0_0_0_1px_rgba(247,201,72,0.2)]'
          : 'bg-[#171717] border-[#2a2a2a] hover:border-[#3a3a3a]'
      }`}
    >
      <div
        className="w-full h-20 rounded-2xl mb-3"
        style={{
          background: `linear-gradient(135deg, ${color}, #1f1f1f)`,
        }}
      />
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-zinc-100">{label}</p>
          <p className="text-[11px] text-zinc-500">{subtitle}</p>
        </div>
        {selected && (
          <div className="w-6 h-6 rounded-full bg-[#4867a8] flex items-center justify-center">
            <Check size={13} className="text-black" />
          </div>
        )}
      </div>
    </button>
  );
}

function DarkFloorCard({
  label,
  type,
  selected,
  onClick,
}: {
  label: string;
  type: FloorMaterial;
  selected: boolean;
  onClick: () => void;
}) {
  const styleMap: Record<FloorMaterial, React.CSSProperties> = {
    oak: {
      background:
        'repeating-linear-gradient(90deg, #8c6239 0px, #8c6239 18px, #6d4c2e 18px, #6d4c2e 22px)',
    },
    tile: {
      background:
        'repeating-conic-gradient(#ddd 0% 25%, #bbb 0% 50%) 0 0 / 20px 20px',
    },
    concrete: {
      background: 'linear-gradient(135deg, #767676, #4d4d4d)',
    },
    marble: {
      background: 'linear-gradient(120deg, #f2f2f2, #cfcfcf, #ececec, #bcbcbc)',
    },
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-3xl overflow-hidden border transition ${
        selected ? 'border-[#4867a8]' : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
      }`}
    >
      <div className="h-16" style={styleMap[type]} />
      <div className={`px-3 py-2 text-xs font-semibold ${selected ? 'bg-[#4867a8] text-black' : 'bg-[#171717] text-zinc-300'}`}>
        {label}
      </div>
    </button>
  );
}

function DarkToolButton({
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
      className={`rounded-2xl border py-3 flex flex-col items-center gap-1 transition ${
        active
          ? 'bg-[#4867a8] text-black border-[#4867a8]'
          : 'bg-[#171717] text-zinc-400 border-[#2a2a2a] hover:text-white'
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

function InfoLineDark({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-white/5 last:border-0">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-sm font-semibold text-zinc-100 text-right">{value}</span>
    </div>
  );
}

function ToggleDark({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button onClick={onToggle} className="w-full flex items-center justify-between text-left">
      <span className="text-sm text-zinc-300">{label}</span>
      <div className={`w-10 h-6 rounded-full relative transition ${checked ? 'bg-[#4867a8]' : 'bg-[#2a2a2a]'}`}>
        <div
          className={`absolute top-[2px] w-5 h-5 rounded-full bg-white transition-all ${
            checked ? 'left-[18px]' : 'left-[2px]'
          }`}
        />
      </div>
    </button>
  );
}

function DarkRailButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition ${
        active
          ? 'bg-[#4867a8] text-black shadow-lg'
          : 'bg-[#171717] border border-[#262626] text-zinc-400 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function FurnitureIconDark({
  type,
  color,
}: {
  type: FurnitureCatalogItem['type'];
  color: string;
}) {
  return (
    <div
      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/5"
      style={{ background: '#202020' }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        {type === 'sofa' && (
          <>
            <rect x="2" y="11" width="20" height="8" rx="3" fill={color} />
            <rect x="4" y="8" width="4" height="5" rx="1.5" fill={color} opacity="0.8" />
            <rect x="16" y="8" width="4" height="5" rx="1.5" fill={color} opacity="0.8" />
          </>
        )}
        {type === 'bed' && (
          <>
            <rect x="2" y="10" width="20" height="10" rx="2" fill={color} />
            <rect x="2" y="7" width="5" height="5" rx="1.5" fill={color} opacity="0.7" />
            <rect x="17" y="7" width="5" height="5" rx="1.5" fill={color} opacity="0.7" />
          </>
        )}
        {type === 'plant' && (
          <>
            <ellipse cx="12" cy="8" rx="5" ry="6" fill={color} />
            <rect x="10" y="13" width="4" height="7" rx="1.5" fill={color} opacity="0.6" />
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

function PropertyStatDark({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#232323] bg-[#171717] px-4 py-3">
      <p className="text-[11px] text-zinc-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-zinc-100 break-all">{value}</p>
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