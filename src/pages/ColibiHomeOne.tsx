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
  Sun,
  Moon,
  Download,
  Eye,
  CircleDot,
  ChevronDown,
  Plus,
  Trash2,
  Copy,
  Save,
  Info,
  FolderOpen,
  Pencil,
  SlidersHorizontal,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildPath } from "../shared/utils";
import * as THREE from 'three';
import { MascotWidget } from '@/shared/components';

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

interface ProjectStep {
  id: string;
  name: string;
  createdAt: string;
}

/* ============================================================================
   CONFIG
============================================================================ */

const COLIBI_BLUE = '#3B5998';
const COLIBI_BLUE_DARK = '#243B70';
const COLIBI_BLUE_SOFT = '#EAF0FF';

const METERS_PER_UNIT = 1;

// NOTE: placeholder material thumbnails — swap for the real brand textures.
const WALL_MATERIAL_IMAGES: Record<WallMaterial, string> = {
  brick: 'https://images.unsplash.com/photo-1495578942200-c5f5d2137def?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  concrete: 'https://images.unsplash.com/photo-1534593963832-01c3595183bd?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

// NOTE: placeholder header banner for "Mes biens" modal — swap for the real asset.
const PROPERTY_MODAL_HEADER_IMAGE =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80';

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

function getFloorLabel(floor: FloorId) {
  return floor === 0 ? 'RDC' : 'Étage 1';
}

function getCatalogItem(catalogId: string) {
  return FURNITURE_CATALOG.find((i) => i.id === catalogId)!;
}

function getSurfaceForProperty(property: PropertyModel) {
  return property.rooms.reduce((acc, room) => acc + room.w * room.h, 0);
}

function getNowLabel() {
  return new Date().toLocaleString('fr-FR');
}

/* ============================================================================
   MAIN
============================================================================ */

export default function ColibiHome() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const isDark = theme === 'dark';

  const [properties, setProperties] = useState<PropertyModel[]>(INITIAL_PROPERTIES);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(INITIAL_PROPERTIES[0].id);

  const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');
  const [currentFloor, setCurrentFloor] = useState<FloorId>(0);

  const [showHomeMenu, setShowHomeMenu] = useState(false);
  const [showFloorMenu, setShowFloorMenu] = useState(false);
  const [showFloorOptions, setShowFloorOptions] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showMyProperties, setShowMyProperties] = useState(false);
  const [showSceneOptions, setShowSceneOptions] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

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
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // Scene / grid options (controlled from the new "Options" modal)
  const [showGrid, setShowGrid] = useState(true);
  const [snapGrid, setSnapGrid] = useState(true);
  const [gridColor, setGridColor] = useState<'sombre' | 'clair'>('sombre');
  const [cellSize, setCellSize] = useState(50);
  const [showLightOrientation, setShowLightOrientation] = useState(true);
  const [skyBackground, setSkyBackground] = useState<'blanc' | 'ciel' | 'nuit'>('blanc');

  const [projectSteps, setProjectSteps] = useState<ProjectStep[]>([
    { id: 'step-1', name: 'Étage 1', createdAt: getNowLabel() },
  ]);
  const [activeStepId, setActiveStepId] = useState('step-1');

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

  const activeStep = projectSteps.find((s) => s.id === activeStepId) ?? projectSteps[0];

  const ui = getThemeClasses(isDark);

  const updateSelectedProperty = (recipe: (draft: PropertyModel) => void) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPropertyId) return p;
        const draft = deepClone(p);
        recipe(draft);
        draft.updatedAt = getNowLabel();
        return draft;
      })
    );
  };

  const renameSelectedProperty = (name: string) => {
    if (!name.trim()) return;
    updateSelectedProperty((draft) => {
      draft.name = name.trim();
    });
  };

  const addProjectStep = () => {
    const step: ProjectStep = {
      id: `step-${Date.now()}`,
      name: `Étage ${projectSteps.length + 1}`,
      createdAt: getNowLabel(),
    };
    setProjectSteps((prev) => [...prev, step]);
    setActiveStepId(step.id);
  };

  const deleteActiveStep = () => {
    if (projectSteps.length <= 1) {
      alert('Impossible de supprimer le dernier étage.');
      return;
    }

    const ok = confirm(`Supprimer ${activeStep?.name ?? 'cet étage'} ?`);
    if (!ok) return;

    setProjectSteps((prev) => {
      const next = prev.filter((s) => s.id !== activeStepId);
      setActiveStepId(next[0].id);
      return next;
    });
  };

  const duplicateProperty = () => {
    const copy = deepClone(selectedProperty);
    copy.id = `prop-${Date.now()}`;
    copy.name = `${selectedProperty.name} copie`;
    copy.createdAt = getNowLabel();
    copy.updatedAt = getNowLabel();

    setProperties((prev) => [...prev, copy]);
    setSelectedPropertyId(copy.id);
    setShowHomeMenu(false);
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
            <PanelSectionTitle title="Types de pièces" isDark={isDark} />

            {ROOM_TYPES.map((rt) => (
              <button
                key={rt.name}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition text-left ${ui.card} ${ui.cardHover}`}
              >
                <span
                  className="w-4 h-4 rounded-md border border-black/10"
                  style={{ background: rt.color }}
                />
                <span className={ui.textStrong}>{rt.name}</span>
              </button>
            ))}
          </div>
        );

      case 'walls':
        return (
          <div className="space-y-6">
            <div>
              <PanelSectionTitle title="Appliquer à" isDark={isDark} />

              <div className="flex gap-2">
                {(['floor', 'wall', 'all'] as TextureScope[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setTextureScope(s)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                      textureScope === s
                        ? 'text-white border-transparent'
                        : `${ui.card} ${ui.mutedText} ${ui.cardHover}`
                    }`}
                    style={textureScope === s ? { backgroundColor: COLIBI_BLUE } : undefined}
                  >
                    {s === 'floor' ? 'Sol' : s === 'wall' ? 'Mur' : 'Tout'}
                  </button>
                ))}
              </div>
            </div>

            {(textureScope === 'wall' || textureScope === 'all') && (
              <div>
                <PanelSectionTitle title="Matériaux muraux" isDark={isDark} />

                <div className="grid grid-cols-2 gap-3">
                  <ThemedMaterialCard
                    isDark={isDark}
                    label="Brique"
                    subtitle="Texture chaude"
                    image={WALL_MATERIAL_IMAGES.brick}
                    selected={selectedWallMaterial === 'brick'}
                    onClick={() => applyMaterialToWallOrFloor('brick')}
                  />
                  <ThemedMaterialCard
                    isDark={isDark}
                    label="Béton"
                    subtitle="Aspect minéral"
                    image={WALL_MATERIAL_IMAGES.concrete}
                    selected={selectedWallMaterial === 'concrete'}
                    onClick={() => applyMaterialToWallOrFloor('concrete')}
                  />
                </div>

                <p className={`text-[11px] mt-3 ${ui.mutedText}`}>
                  {selectedWallId
                    ? 'Appliqué au mur sélectionné.'
                    : `Appliqué aux murs du ${getFloorLabel(currentFloor)}.`}
                </p>
              </div>
            )}

            {(textureScope === 'floor' || textureScope === 'all') && (
              <div>
                <PanelSectionTitle title="Revêtements de sol" isDark={isDark} />

                <div className="grid grid-cols-2 gap-3">
                  <ThemedFloorCard
                    isDark={isDark}
                    label="Parquet"
                    type="oak"
                    selected={selectedFloorMaterial === 'oak'}
                    onClick={() => setSelectedFloorMaterial('oak')}
                  />
                  <ThemedFloorCard
                    isDark={isDark}
                    label="Carrelage"
                    type="tile"
                    selected={selectedFloorMaterial === 'tile'}
                    onClick={() => setSelectedFloorMaterial('tile')}
                  />
                  <ThemedFloorCard
                    isDark={isDark}
                    label="Béton ciré"
                    type="concrete"
                    selected={selectedFloorMaterial === 'concrete'}
                    onClick={() => setSelectedFloorMaterial('concrete')}
                  />
                  <ThemedFloorCard
                    isDark={isDark}
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
            <PanelSectionTitle title="Outils de conception" isDark={isDark} />

            <div className="grid grid-cols-3 gap-2">
              <ThemedToolButton
                isDark={isDark}
                active={tool === 'select'}
                icon={<Square size={14} />}
                label="Select"
                onClick={() => {
                  setTool('select');
                  setPendingCatalogId(null);
                }}
              />
              <ThemedToolButton
                isDark={isDark}
                active={tool === 'paintWall'}
                icon={<Paintbrush size={14} />}
                label="Peindre"
                onClick={() => {
                  setTool('paintWall');
                  setPendingCatalogId(null);
                }}
              />
              <ThemedToolButton
                isDark={isDark}
                active={tool === 'measure'}
                icon={<Ruler size={14} />}
                label="Règle"
                onClick={() => {
                  setTool('measure');
                  setPendingCatalogId(null);
                }}
              />
            </div>

            <div className={`rounded-3xl border p-4 space-y-3 ${ui.card}`}>
              <InfoLineThemed isDark={isDark} label="Mode" value={
                tool === 'select'
                  ? 'Sélection'
                  : tool === 'measure'
                  ? 'Mesure'
                  : tool === 'paintWall'
                  ? 'Peinture'
                  : 'Placement'
              } />
              <InfoLineThemed isDark={isDark} label="Étage" value={getFloorLabel(currentFloor)} />
              <InfoLineThemed isDark={isDark} label="Étage actif" value={activeStep?.name ?? 'Étage 1'} />

              {selectedWallId && <InfoLineThemed isDark={isDark} label="Mur" value={selectedWallId} />}

              {selectedFurnitureId && (
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${ui.mutedText}`}>Meuble</span>
                  <button
                    onClick={removeSelectedFurniture}
                    className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-[11px] font-semibold border border-red-500/20 hover:bg-red-500/15"
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>

            {measurePoints.length > 0 && (
              <button
                onClick={() => setMeasurePoints([])}
                className={`w-full py-3 rounded-2xl border text-sm transition ${ui.card} ${ui.cardHover} ${ui.text}`}
              >
                Effacer la mesure
              </button>
            )}
          </div>
        );

      case 'furniture':
        return (
          <div className="space-y-3">
            <PanelSectionTitle title="Catalogue meubles" isDark={isDark} />

            {FURNITURE_CATALOG.map((item) => (
              <div
                key={item.id}
                className={`rounded-3xl border p-4 ${ui.card}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <FurnitureIconThemed type={item.type} color={item.color} isDark={isDark} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${ui.textStrong}`}>{item.name}</p>
                    <p className={`text-xs ${ui.mutedText}`}>{item.price} EUR</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className={`w-8 h-8 rounded-full border ${ui.smallButton}`}
                    >
                      −
                    </button>
                    <span className={`w-6 text-center text-sm font-bold ${ui.textStrong}`}>
                      {cart[item.id] ?? 0}
                    </span>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="w-8 h-8 rounded-full text-white font-bold"
                      style={{ backgroundColor: COLIBI_BLUE }}
                    >
                      +
                    </button>
                  </div>

                  {(cart[item.id] ?? 0) > 0 && (
                    <button
                      onClick={() => beginPlacement(item.id)}
                      className={`px-3 py-2 rounded-full border text-xs font-semibold ${ui.smallButton}`}
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
    <div
      className={`relative w-full h-screen overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#081225] text-white' : 'bg-[#f5f7fb] text-slate-900'
      }`}
    >
      {/* Workspace */}
      {viewMode === '2D' ? (
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-[radial-gradient(circle_at_top,#172B55_0%,#081225_55%,#050915_100%)]'
              : 'bg-[#f5f7fb]'
          }`}
        >
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
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-[radial-gradient(circle_at_top,#172B55_0%,#081225_55%,#050915_100%)]'
              : 'bg-[radial-gradient(circle_at_top,#ffffff_0%,#f3f6fb_50%,#e9eef8_100%)]'
          }`}
        >
          <ThreeWorkspace
            property={selectedProperty}
            currentFloor={currentFloor}
            showAllFloors={showAllFloors}
            selectedWallId={selectedWallId}
            selectedFurnitureId={selectedFurnitureId}
            measurePoints={measurePoints}
            showGrid={showGrid}
            gridColor={gridColor}
            cellSize={cellSize}
            skyBackground={skyBackground}
            onHit={handleWorkspaceHit}
          />
        </div>
      )}

      {/* Header */}
      <header
        className={`absolute top-4 left-4 right-4 h-14 z-40 flex items-center justify-between rounded-[24px] border px-4 backdrop-blur-xl shadow-[0_12px_30px_rgba(15,23,42,0.10)] transition-all ${
          isDark
            ? 'bg-[#0B1730]/88 border-white/10 shadow-[0_12px_34px_rgba(0,0,0,0.35)]'
            : 'bg-white/92 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-4">
          <Link to={buildPath("/", { country: "france" })} className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm overflow-hidden"
              style={{ backgroundColor: COLIBI_BLUE }}
            >
              <img
                src="/images/Logo_blanc.png"
                alt="Colibi"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div className="leading-tight">
              <p className={`text-sm font-bold ${ui.textStrong}`}>W-ArtHome</p>
              <p className={`text-[10px] uppercase tracking-[0.2em] ${ui.mutedText}`}>3D models</p>
            </div>
          </Link>

          <div className={`w-px h-6 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

          {/* Nouveau bien dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowHomeMenu((v) => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-sm transition ${ui.hoverSoft}`}
            >
              <Home size={16} className={ui.iconMuted} />
              <span className={`${ui.text} font-semibold`}>{selectedProperty.name}</span>
              <ChevronDown size={15} className={ui.iconMuted} />
            </button>

            {showHomeMenu && (
              <div
                className={`absolute top-full left-0 mt-3 w-[300px] rounded-[28px] border shadow-2xl overflow-hidden z-50 ${
                  isDark ? 'bg-[#0B1730] border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <div className={`px-4 py-3 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                  {isRenaming ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          renameSelectedProperty(renameValue);
                          setIsRenaming(false);
                        }
                        if (e.key === 'Escape') setIsRenaming(false);
                      }}
                      onBlur={() => {
                        renameSelectedProperty(renameValue);
                        setIsRenaming(false);
                      }}
                      className={`w-full text-sm font-bold rounded-xl px-2 py-1 outline-none border ${
                        isDark ? 'bg-[#13244A] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  ) : (
                    <p className={`text-xs font-bold ${ui.textStrong}`}>{selectedProperty.name}</p>
                  )}
                  <p className={`text-[11px] mt-1 ${ui.mutedText}`}>
                    Modifié le {selectedProperty.updatedAt}
                  </p>
                </div>

                <div className="p-2 space-y-1">
                  <DropdownAction
                    isDark={isDark}
                    icon={<Pencil size={15} />}
                    label="Renommer"
                    onClick={() => {
                      setRenameValue(selectedProperty.name);
                      setIsRenaming(true);
                    }}
                  />
                  <DropdownAction
                    isDark={isDark}
                    icon={<Info size={15} />}
                    label="Informations sur ce bien"
                    onClick={() => {
                      setShowInfoModal(true);
                      setShowHomeMenu(false);
                    }}
                  />
                  <DropdownAction
                    isDark={isDark}
                    icon={<Save size={15} />}
                    label="Sauvegarder"
                    onClick={() => {
                      alert('Bien sauvegardé !');
                      setShowHomeMenu(false);
                    }}
                  />
                  <DropdownAction
                    isDark={isDark}
                    icon={<Copy size={15} />}
                    label="Dupliquer le bien"
                    onClick={duplicateProperty}
                  />
                </div>

                <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-slate-100'}`} />

                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowMyProperties(true);
                      setShowHomeMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-bold transition ${
                      isDark ? 'text-white hover:bg-white/8' : 'text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <FolderOpen size={15} />
                    <span>Voir mes biens</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Étages dropdown — separate from "Nouveau bien" */}
          <div className="relative">
            <button
              onClick={() => setShowFloorMenu((v) => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-sm transition ${ui.hoverSoft}`}
            >
              <Layers size={16} className={ui.iconMuted} />
              <span className={ui.text}>Étages</span>
              <ChevronDown size={15} className={ui.iconMuted} />
            </button>

            {showFloorMenu && (
              <div
                className={`absolute top-full left-0 mt-3 w-[260px] rounded-[26px] border shadow-2xl overflow-hidden z-50 ${
                  isDark ? 'bg-[#0B1730] border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <div className={`px-4 py-3 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                  <p className={`text-xs font-bold ${ui.textStrong}`}>{getFloorLabel(currentFloor)} actif</p>
                  <p className={`text-[11px] ${ui.mutedText}`}>
                    {projectSteps.length} étage{projectSteps.length > 1 ? 's' : ''} créé{projectSteps.length > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="p-2 space-y-1">
                  <DropdownAction
                    isDark={isDark}
                    icon={<Plus size={15} />}
                    label="Ajouter un étage"
                    onClick={() => {
                      addProjectStep();
                      setShowFloorMenu(false);
                    }}
                  />
                  <DropdownAction
                    isDark={isDark}
                    icon={<Trash2 size={15} />}
                    label="Supprimer l'étage actif"
                    danger
                    onClick={() => {
                      deleteActiveStep();
                      setShowFloorMenu(false);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Header center/action */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center rounded-full p-1 border ${
              isDark ? 'bg-[#13244A] border-white/10' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => setViewMode('2D')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                viewMode === '2D'
                  ? isDark
                    ? 'bg-white text-[#13244A]'
                    : 'bg-white text-slate-900 shadow-sm'
                  : `${ui.mutedText} hover:${ui.textStrong}`
              }`}
            >
              2D
            </button>
            <button
              onClick={() => setViewMode('3D')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                viewMode === '3D'
                  ? isDark
                    ? 'bg-white text-[#13244A]'
                    : 'bg-white text-slate-900 shadow-sm'
                  : `${ui.mutedText} hover:${ui.textStrong}`
              }`}
            >
              3D
            </button>
          </div>

          <button
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition ${ui.headerButton}`}
            title="Annuler"
          >
            <Undo2 size={16} />
          </button>
          <button
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition ${ui.headerButton}`}
            title="Rétablir"
          >
            <Redo2 size={16} />
          </button>

          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition ${ui.headerButton}`}
            title={isDark ? 'Passer en thème clair' : 'Passer en thème sombre'}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* "Publier" -> "Sauvegarder" */}
          <button
            className="px-4 h-10 rounded-xl text-white text-xs font-bold flex items-center gap-2 hover:brightness-95 transition"
            style={{ backgroundColor: COLIBI_BLUE }}
            onClick={() => alert('Bien sauvegardé !')}
          >
            <Save size={15} />
            Sauvegarder
          </button>

          {/* Share icon -> Cart icon */}
          <button
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition ${ui.headerButton}`}
            title="Panier"
            onClick={() => setShowCart(true)}
          >
            <ShoppingBag size={16} />
          </button>

          {/* "More" icon -> Profile icon */}
          <button
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition ${ui.headerButton}`}
            title="Profil"
          >
            <User size={16} />
          </button>
        </div>
      </header>

      {/* Left rail */}
      <div className="absolute top-24 left-4 bottom-4 w-[92px] z-30">
        <div
          className={`h-3/4 rounded-[28px] border backdrop-blur-xl p-3 flex flex-col justify-between shadow-[0_16px_35px_rgba(15,23,42,0.10)] ${
            isDark
              ? 'bg-[#0B1730]/88 border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.35)]'
              : 'bg-white/92 border-slate-200'
          }`}
        >
          <div className="space-y-3 flex flex-col items-center">
            <RailButtonThemed isDark={isDark} active={tool === 'select'} onClick={() => { setTool('select'); setPendingCatalogId(null); }}>
              <CircleDot size={18} />
            </RailButtonThemed>
            <RailButtonThemed isDark={isDark} active={tool === 'paintWall'} onClick={() => { setTool('paintWall'); setPendingCatalogId(null); }}>
              <Paintbrush size={18} />
            </RailButtonThemed>
            <RailButtonThemed isDark={isDark} active={tool === 'measure'} onClick={() => { setTool('measure'); setPendingCatalogId(null); }}>
              <Ruler size={18} />
            </RailButtonThemed>
            <RailButtonThemed isDark={isDark} active={showFloorOptions} onClick={() => setShowFloorOptions((v) => !v)}>
              <Layers size={18} />
            </RailButtonThemed>
            <RailButtonThemed isDark={isDark} onClick={() => setShowCart(true)}>
              <ShoppingBag size={18} />
            </RailButtonThemed>
            <RailButtonThemed isDark={isDark} active={showSceneOptions} onClick={() => setShowSceneOptions(true)}>
              <Settings size={18} />
            </RailButtonThemed>
          </div>

          <div
            className={`rounded-[22px] p-2 flex flex-col items-center gap-1 ${
              isDark ? 'bg-[#13244A] border border-white/10' : 'bg-slate-50 border border-slate-100'
            }`}
          >
            <button
              onClick={() => setCurrentFloor(1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                currentFloor === 1 ? 'text-white' : `${ui.mutedText} hover:${ui.text}`
              }`}
              style={currentFloor === 1 ? { backgroundColor: COLIBI_BLUE } : undefined}
            >
              <ArrowUp size={16} />
            </button>

            <span className={`text-xl font-light leading-none ${ui.textStrong}`}>
              {currentFloor}
            </span>

            <button
              onClick={() => setCurrentFloor(0)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                currentFloor === 0 ? 'text-white' : `${ui.mutedText} hover:${ui.text}`
              }`}
              style={currentFloor === 0 ? { backgroundColor: COLIBI_BLUE } : undefined}
            >
              <ArrowDown size={16} />
            </button>

            <span className={`text-[10px] uppercase tracking-[0.18em] pt-1 ${ui.mutedText}`}>
              {getFloorLabel(currentFloor)}
            </span>
          </div>
        </div>
        <MascotWidget />
      </div>

      {/* Right panel — collapsible Design Panel */}
      <div className={`absolute top-24 right-4 bottom-4 z-30 transition-all duration-300 ${isPanelOpen ? 'w-[360px]' : 'w-[64px]'}`}>
        {isPanelOpen ? (
          <div
            className={`h-full rounded-[32px] border backdrop-blur-xl shadow-[0_16px_35px_rgba(15,23,42,0.10)] p-4 flex flex-col ${
              isDark
                ? 'bg-[#0B1730]/90 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.42)]'
                : 'bg-white/94 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Eye size={16} style={{ color: COLIBI_BLUE }} />
                <span className={`text-sm font-semibold ${ui.textStrong}`}>Design Panel</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSceneOptions(true)}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center ${ui.headerButton}`}
                  title="Paramètres de la scène"
                >
                  <SlidersHorizontal size={15} />
                </button>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center ${ui.headerButton}`}
                  title="Réduire"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-5">
              {LEFT_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setLeftTab(tab.id)}
                  className={`flex flex-col items-center justify-center gap-1 py-3 rounded-2xl border transition ${
                    leftTab === tab.id
                      ? 'text-white border-transparent'
                      : `${ui.card} ${ui.mutedText} ${ui.cardHover}`
                  }`}
                  style={leftTab === tab.id ? { backgroundColor: COLIBI_BLUE } : undefined}
                >
                  {tab.icon}
                  <span className="text-[10px] font-bold">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {renderPanelContent()}
            </div>

            <div className={`pt-4 mt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
              <button
                onClick={() => {
                  setTool('select');
                  setPendingCatalogId(null);
                  setMeasurePoints([]);
                }}
                className={`w-full py-3 rounded-2xl border text-sm transition ${ui.card} ${ui.cardHover} ${ui.text}`}
              >
                Réinitialiser l'outil
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsPanelOpen(true)}
            className={`h-full w-full rounded-[32px] border backdrop-blur-xl shadow-[0_16px_35px_rgba(15,23,42,0.10)] flex flex-col items-center justify-center gap-4 px-2 transition ${
              isDark
                ? 'bg-[#0B1730]/90 border-white/10 hover:bg-[#13244A]'
                : 'bg-white/94 border-slate-200 hover:bg-slate-50'
            }`}
            title="Ouvrir pour dessiner le plan 2D"
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
              style={{ backgroundColor: COLIBI_BLUE }}
            >
              <ChevronLeftIcon />
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-[0.15em] [writing-mode:vertical-rl] ${ui.mutedText}`}
            >
              Ouvrir pour dessiner le plan 2D
            </span>
          </button>
        )}
      </div>

      {/* Bottom status */}
      {(pendingCatalogId || measuredDistance) && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-3">
          {pendingCatalogId && (
            <div
              className="px-5 py-3 rounded-full text-white text-xs font-bold shadow-xl"
              style={{ backgroundColor: COLIBI_BLUE }}
            >
              Placement : {getCatalogItem(pendingCatalogId).name}
            </div>
          )}

          {measuredDistance && (
            <div className={`px-5 py-3 rounded-full text-xs font-bold shadow-xl ${
              isDark ? 'bg-white text-[#13244A]' : 'bg-slate-900 text-white'
            }`}>
              Distance : {measuredDistance} m
            </div>
          )}
        </div>
      )}

      {/* Floor visibility options */}
      {showFloorOptions && (
        <div
          className={`absolute left-28 bottom-6 z-40 w-[320px] rounded-[30px] border backdrop-blur-xl p-5 shadow-2xl ${
            isDark ? 'bg-[#0B1730]/96 border-white/10' : 'bg-white/96 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className={`text-sm font-bold ${ui.textStrong}`}>Étages</h3>
            <button
              onClick={() => setShowFloorOptions(false)}
              className={`w-8 h-8 rounded-full border flex items-center justify-center ${ui.headerButton}`}
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <ToggleThemed
              isDark={isDark}
              label="Afficher uniquement l'étage actuel"
              checked={onlyShowCurrentFloor}
              onToggle={() => {
                const next = !onlyShowCurrentFloor;
                setOnlyShowCurrentFloor(next);
                if (next) setShowAllFloors(false);
              }}
            />
            <ToggleThemed
              isDark={isDark}
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
                    ? 'text-white border-transparent'
                    : `${ui.card} ${ui.cardHover} ${ui.text}`
                }`}
                style={currentFloor === f ? { backgroundColor: COLIBI_BLUE } : undefined}
              >
                <span className="text-sm font-semibold">{getFloorLabel(f)}</span>
                <span className="text-xs font-bold">{f}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scene options modal — Grid + Visualisation 3D (settings icon on Design Panel) */}
      {showSceneOptions && (
        <div className="absolute inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className={`w-[420px] max-h-[88vh] overflow-y-auto rounded-[30px] border shadow-2xl relative ${
              isDark ? 'bg-[#0B1730] border-white/10' : 'bg-white border-slate-200'
            }`}
          >
            <div className={`px-6 py-5 flex items-center justify-between border-b sticky top-0 backdrop-blur-xl ${
              isDark ? 'border-white/10 bg-[#0B1730]/95' : 'border-slate-100 bg-white/95'
            }`}>
              <h3 className={`text-sm font-black uppercase tracking-[0.15em] ${ui.textStrong}`}>Options</h3>
              <button
                onClick={() => setShowSceneOptions(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: COLIBI_BLUE }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <PanelSectionTitle title="Grid" isDark={isDark} />
                <div className="space-y-3">
                  <ToggleThemed isDark={isDark} label="Afficher grid" checked={showGrid} onToggle={() => setShowGrid((v) => !v)} />
                  <ToggleThemed isDark={isDark} label="Snap grid" checked={snapGrid} onToggle={() => setSnapGrid((v) => !v)} />

                  <div className="flex items-center justify-between pt-1">
                    <span className={`text-sm ${ui.text}`}>Couleur du grid</span>
                    <select
                      value={gridColor}
                      onChange={(e) => setGridColor(e.target.value as 'sombre' | 'clair')}
                      className={`text-sm font-semibold rounded-xl px-3 py-2 border outline-none ${ui.card} ${ui.text}`}
                    >
                      <option value="sombre">Sombre</option>
                      <option value="clair">Clair</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${ui.text}`}>Taille cellule</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={cellSize}
                      onChange={(e) => setCellSize(Number(e.target.value))}
                      className="w-full accent-[#3B5998]"
                    />
                  </div>
                </div>
              </div>

              <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-slate-100'}`} />

              <div>
                <PanelSectionTitle title="Visualisation 3D" isDark={isDark} />
                <div className="space-y-3">
                  <ToggleThemed
                    isDark={isDark}
                    label="Afficher option orientation de la lumière"
                    checked={showLightOrientation}
                    onToggle={() => setShowLightOrientation((v) => !v)}
                  />

                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${ui.text}`}>Sky background</span>
                    <select
                      value={skyBackground}
                      onChange={(e) => setSkyBackground(e.target.value as 'blanc' | 'ciel' | 'nuit')}
                      className={`text-sm font-semibold rounded-xl px-3 py-2 border outline-none ${ui.card} ${ui.text}`}
                    >
                      <option value="blanc">Blanc</option>
                      <option value="ciel">Ciel</option>
                      <option value="nuit">Nuit</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart modal */}
      {showCart && (
        <div className="absolute inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className={`w-[560px] max-h-[88vh] overflow-hidden rounded-[34px] border shadow-2xl flex flex-col ${
              isDark ? 'bg-[#0B1730] border-white/10' : 'bg-white border-slate-200'
            }`}
          >
            <div className={`px-7 py-6 flex items-center justify-between border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
              <h3 className={`text-xl font-bold ${ui.textStrong}`}>Panier meubles</h3>
              <button
                onClick={() => setShowCart(false)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center ${ui.headerButton}`}
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
                    className={`rounded-3xl border p-4 ${ui.card}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <FurnitureIconThemed type={item.type} color={item.color} isDark={isDark} />
                        <div>
                          <p className={`text-sm font-semibold ${ui.textStrong}`}>{item.name}</p>
                          <p className={`text-xs ${ui.mutedText}`}>{item.price} EUR / unité</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className={`w-8 h-8 rounded-full border ${ui.smallButton}`}
                        >
                          −
                        </button>
                        <span className={`w-6 text-center text-sm font-bold ${ui.textStrong}`}>{qty}</span>
                        <button
                          onClick={() => addToCart(item.id)}
                          className="w-8 h-8 rounded-full text-white font-bold"
                          style={{ backgroundColor: COLIBI_BLUE }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {qty > 0 && (
                      <div className={`pt-4 mt-4 border-t flex items-center justify-between ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                        <span className={`text-sm ${ui.mutedText}`}>
                          Total ligne : <strong className={ui.textStrong}>{item.price * qty} EUR</strong>
                        </span>
                        <button
                          onClick={() => beginPlacement(item.id)}
                          className="px-4 py-2 rounded-full text-white text-xs font-bold"
                          style={{ backgroundColor: COLIBI_BLUE }}
                        >
                          Placer dans la scène
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={`px-7 py-6 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
              <button
                className="w-full py-4 rounded-[20px] text-white text-lg font-black hover:brightness-95"
                style={{ backgroundColor: COLIBI_BLUE }}
              >
                Total : {totalCartPrice} EUR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info modal */}
      {showInfoModal && (
        <div className="absolute inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className={`w-[440px] rounded-[30px] border p-6 shadow-2xl relative ${
              isDark ? 'bg-[#0B1730] border-white/10' : 'bg-white border-slate-200'
            }`}
          >
            <button
              onClick={() => setShowInfoModal(false)}
              className={`absolute top-4 right-4 w-9 h-9 rounded-full border flex items-center justify-center ${ui.headerButton}`}
            >
              <X size={16} />
            </button>

            <div
              className="inline-flex px-4 py-2 rounded-full text-white text-xs font-black uppercase tracking-[0.15em] mb-5"
              style={{ backgroundColor: COLIBI_BLUE }}
            >
              Informations
            </div>

            <div className="space-y-3">
              <InfoLineThemed isDark={isDark} label="Nom" value={selectedProperty.name} />
              <InfoLineThemed isDark={isDark} label="Étage actif" value={activeStep?.name ?? 'Étage 1'} />
              <InfoLineThemed isDark={isDark} label="Nombre d'étages" value={String(projectSteps.length)} />
              <InfoLineThemed isDark={isDark} label="Étages du bien" value={String(selectedProperty.floorsCount)} />
              <InfoLineThemed isDark={isDark} label="Pièces" value={String(selectedProperty.rooms.length)} />
              <InfoLineThemed isDark={isDark} label="Surface totale" value={`${totalSurface.toFixed(2)} m²`} />
              <InfoLineThemed isDark={isDark} label="Meubles placés" value={String(selectedProperty.furnitures.length)} />
            </div>
          </div>
        </div>
      )}

      {/* My properties — modal with image header banner + 3D thumbnail list */}
      {showMyProperties && (
        <div className="absolute inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className={`w-[980px] max-h-[88vh] overflow-hidden rounded-[34px] border shadow-2xl flex flex-col relative ${
              isDark ? 'bg-[#081225] border-white/10' : 'bg-white border-slate-200'
            }`}
          >
            <button
              onClick={() => setShowMyProperties(false)}
              className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full border flex items-center justify-center ${ui.headerButton}`}
            >
              <X size={18} />
            </button>

            <div
              className="h-44 relative flex items-end px-8 pb-8 border-b border-white/10 bg-cover bg-center"
              style={{ backgroundImage: `url(${PROPERTY_MODAL_HEADER_IMAGE})` }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: isDark
                    ? 'linear-gradient(180deg, rgba(8,18,37,0.25) 0%, rgba(8,18,37,0.92) 100%)'
                    : 'linear-gradient(180deg, rgba(36,59,112,0.15) 0%, rgba(8,18,37,0.78) 100%)',
                }}
              />

              <div className="relative">
                <p
                  className="text-[11px] uppercase tracking-[0.2em] mb-2 font-bold"
                  style={{ color: '#AFC2F5' }}
                >
                  Portfolio
                </p>
                <h2 className="text-3xl font-black text-white">Mes biens — W-ArtHome</h2>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className={`rounded-[28px] border p-5 grid grid-cols-[260px_1fr_220px] gap-5 ${
                    property.id === selectedPropertyId
                      ? isDark
                        ? 'bg-[#13244A] border-[#3B5998]'
                        : 'bg-[#EAF0FF] border-[#3B5998]'
                      : ui.card
                  }`}
                >
                  <div className={`h-40 rounded-2xl overflow-hidden border ${isDark ? 'border-white/10 bg-[#081225]' : 'border-slate-200 bg-slate-50'}`}>
                    <MiniPropertyPreview3D property={property} />
                  </div>

                  <div>
                    <p className={`text-lg font-bold mb-2 ${ui.textStrong}`}>{property.name}</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <PropertyStatThemed isDark={isDark} label="Créé le" value={property.createdAt} />
                      <PropertyStatThemed isDark={isDark} label="Modifié le" value={property.updatedAt} />
                      <PropertyStatThemed isDark={isDark} label="Étages" value={String(property.floorsCount)} />
                      <PropertyStatThemed isDark={isDark} label="Pièces" value={String(property.rooms.length)} />
                      <PropertyStatThemed isDark={isDark} label="Surface" value={`${getSurfaceForProperty(property).toFixed(2)} m²`} />
                      <PropertyStatThemed isDark={isDark} label="Fichier" value={`${property.id}.json`} />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSelectedPropertyId(property.id);
                        setShowMyProperties(false);
                      }}
                      className="w-full py-4 rounded-2xl text-white font-black hover:brightness-95"
                      style={{ backgroundColor: COLIBI_BLUE }}
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
   THEME CLASSES
============================================================================ */

function getThemeClasses(isDark: boolean) {
  return {
    text: isDark ? 'text-zinc-200' : 'text-slate-700',
    textStrong: isDark ? 'text-white' : 'text-slate-900',
    mutedText: isDark ? 'text-blue-100/55' : 'text-slate-500',
    iconMuted: isDark ? 'text-blue-100/55' : 'text-slate-400',

    hoverSoft: isDark ? 'hover:bg-white/8' : 'hover:bg-slate-100',

    headerButton: isDark
      ? 'bg-[#13244A] border-white/10 text-blue-100/70 hover:text-white hover:bg-[#19305F]'
      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50',

    card: isDark
      ? 'bg-[#13244A] border-white/10'
      : 'bg-white border-slate-200',

    cardHover: isDark
      ? 'hover:border-[#3B5998] hover:bg-[#19305F]'
      : 'hover:border-[#3B5998]/40 hover:bg-[#f8faff]',

    smallButton: isDark
      ? 'bg-[#0B1730] border-white/10 text-blue-100/70 hover:text-white hover:bg-[#19305F]'
      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  };
}

/* ============================================================================
   SMALL COMPONENTS
============================================================================ */

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PanelSectionTitle({ title, isDark }: { title: string; isDark: boolean }) {
  return (
    <div className="mb-3">
      <p className={`text-[11px] uppercase tracking-[0.22em] ${
        isDark ? 'text-blue-100/50' : 'text-slate-500'
      }`}>
        {title}
      </p>
    </div>
  );
}

function DropdownAction({
  isDark,
  icon,
  label,
  danger,
  onClick,
}: {
  isDark: boolean;
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition ${
        danger
          ? 'text-red-500 hover:bg-red-500/10'
          : isDark
          ? 'text-zinc-200 hover:bg-white/8'
          : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function RailButtonThemed({
  children,
  active,
  onClick,
  isDark,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition ${
        active
          ? 'text-white border-transparent shadow-lg'
          : isDark
          ? 'bg-[#13244A] border-white/10 text-blue-100/65 hover:text-white hover:bg-[#19305F]'
          : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white'
      }`}
      style={active ? { backgroundColor: COLIBI_BLUE } : undefined}
    >
      {children}
    </button>
  );
}

function ThemedToolButton({
  icon,
  label,
  active,
  onClick,
  isDark,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border py-3 flex flex-col items-center gap-1 transition ${
        active
          ? 'text-white border-transparent'
          : isDark
          ? 'bg-[#13244A] text-blue-100/65 border-white/10 hover:text-white hover:bg-[#19305F]'
          : 'bg-white text-slate-500 border-slate-200 hover:text-slate-900 hover:border-[#3B5998]/40'
      }`}
      style={active ? { backgroundColor: COLIBI_BLUE } : undefined}
    >
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

function ThemedMaterialCard({
  label,
  subtitle,
  image,
  selected,
  onClick,
  isDark,
}: {
  label: string;
  subtitle: string;
  image: string;
  selected: boolean;
  onClick: () => void;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-3xl border p-3 text-left transition ${
        selected
          ? isDark
            ? 'bg-[#19305F] border-[#3B5998]'
            : 'bg-[#EAF0FF] border-[#3B5998]'
          : isDark
          ? 'bg-[#13244A] border-white/10 hover:border-[#3B5998]'
          : 'bg-white border-slate-200 hover:border-[#3B5998]/40'
      }`}
    >
      <div
        className="w-full h-20 rounded-2xl mb-3 shadow-inner bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />

      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{label}</p>
          <p className={`text-[11px] ${isDark ? 'text-blue-100/55' : 'text-slate-500'}`}>{subtitle}</p>
        </div>

        {selected && (
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: COLIBI_BLUE }}>
            <Check size={13} />
          </div>
        )}
      </div>
    </button>
  );
}

function ThemedFloorCard({
  label,
  type,
  selected,
  onClick,
  isDark,
}: {
  label: string;
  type: FloorMaterial;
  selected: boolean;
  onClick: () => void;
  isDark: boolean;
}) {
  const styleMap: Record<FloorMaterial, React.CSSProperties> = {
    oak: {
      background:
        'repeating-linear-gradient(90deg, #c8a165 0px, #c8a165 18px, #b8924f 18px, #b8924f 22px)',
    },
    tile: {
      background:
        'repeating-conic-gradient(#f8fafc 0% 25%, #e2e8f0 0% 50%) 0 0 / 20px 20px',
    },
    concrete: {
      background: 'linear-gradient(135deg, #9ca3af, #64748b)',
    },
    marble: {
      background: 'linear-gradient(120deg, #ffffff, #e2e8f0, #f8fafc, #cbd5e1)',
    },
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-3xl overflow-hidden border transition ${
        selected
          ? 'border-[#3B5998]'
          : isDark
          ? 'border-white/10 hover:border-[#3B5998]'
          : 'border-slate-200 hover:border-[#3B5998]/40'
      }`}
    >
      <div className="h-16" style={styleMap[type]} />
      <div
        className={`px-3 py-2 text-xs font-semibold ${
          selected
            ? 'text-white'
            : isDark
            ? 'bg-[#13244A] text-zinc-200'
            : 'bg-white text-slate-700'
        }`}
        style={selected ? { backgroundColor: COLIBI_BLUE } : undefined}
      >
        {label}
      </div>
    </button>
  );
}

function InfoLineThemed({
  label,
  value,
  isDark,
}: {
  label: string;
  value: string;
  isDark: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 py-2 border-b last:border-0 ${
      isDark ? 'border-white/10' : 'border-slate-100'
    }`}>
      <span className={`text-xs ${isDark ? 'text-blue-100/55' : 'text-slate-500'}`}>{label}</span>
      <span className={`text-sm font-semibold text-right ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {value}
      </span>
    </div>
  );
}

function ToggleThemed({
  label,
  checked,
  onToggle,
  isDark,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  isDark: boolean;
}) {
  return (
    <button onClick={onToggle} className="w-full flex items-center justify-between text-left">
      <span className={`text-sm ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{label}</span>

      <div
        className={`w-10 h-6 rounded-full relative transition ${
          checked ? '' : isDark ? 'bg-white/15' : 'bg-slate-300'
        }`}
        style={checked ? { backgroundColor: COLIBI_BLUE } : undefined}
      >
        <div
          className={`absolute top-[2px] w-5 h-5 rounded-full bg-white transition-all shadow-sm ${
            checked ? 'left-[18px]' : 'left-[2px]'
          }`}
        />
      </div>
    </button>
  );
}

function FurnitureIconThemed({
  type,
  color,
  isDark,
}: {
  type: FurnitureCatalogItem['type'];
  color: string;
  isDark: boolean;
}) {
  return (
    <div
      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
        isDark ? 'bg-[#0B1730] border-white/10' : 'bg-slate-50 border-slate-200'
      }`}
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

function PropertyStatThemed({
  label,
  value,
  isDark,
}: {
  label: string;
  value: string;
  isDark: boolean;
}) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${
      isDark ? 'bg-[#0B1730] border-white/10' : 'bg-white border-slate-200'
    }`}>
      <p className={`text-[11px] mb-1 ${isDark ? 'text-blue-100/55' : 'text-slate-500'}`}>{label}</p>
      <p className={`text-sm font-semibold break-all ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
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
  showGrid = true,
  gridColor = 'sombre',
  cellSize = 50,
  skyBackground = 'blanc',
  onHit,
}: {
  property: PropertyModel;
  currentFloor: FloorId;
  showAllFloors: boolean;
  selectedWallId: string | null;
  selectedFurnitureId: string | null;
  measurePoints: [number, number][];
  showGrid?: boolean;
  gridColor?: 'sombre' | 'clair';
  cellSize?: number;
  skyBackground?: 'blanc' | 'ciel' | 'nuit';
  onHit: (hit: WorkspaceHit) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;
    const scene = new THREE.Scene();
    const bgColor =
      skyBackground === 'nuit' ? 0x0b1730 : skyBackground === 'ciel' ? 0xbfdcf7 : 0xf4f7fb;
    scene.background = new THREE.Color(bgColor);

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

    const gridLineColor = gridColor === 'sombre' ? 0x9fb0d6 : 0xe8eef8;
    const gridCenterColor = gridColor === 'sombre' ? 0x6f86bd : 0xd0dcee;
    const gridDivisions = Math.max(10, Math.round(100 / (cellSize / 25)));
    const grid = new THREE.GridHelper(100, gridDivisions, gridCenterColor, gridLineColor);
    grid.visible = showGrid;
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
  }, [property, currentFloor, showAllFloors, selectedWallId, selectedFurnitureId, measurePoints, showGrid, gridColor, cellSize, skyBackground, onHit]);

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