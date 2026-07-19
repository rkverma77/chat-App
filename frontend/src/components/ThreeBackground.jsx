import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useThemeStore } from '../store/useThemeStore';
import * as THREE from 'three';

const PALETTE_COLORS = {
  emerald: { dark: '#00D084', light: '#059669' },
  blue: { dark: '#3b82f6', light: '#2563eb' },
  rose: { dark: '#f43f5e', light: '#e11d48' },
  violet: { dark: '#8b5cf6', light: '#7c3aed' },
  amber: { dark: '#f59e0b', light: '#d97706' },
};

const Particles = ({ theme, palette }) => {
  const pointsRef = useRef();

  // Determine colors based on theme and palette
  const particleColor = PALETTE_COLORS[palette]?.[theme] || PALETTE_COLORS.emerald.dark;
  
  // Setup grid parameters for a wavy mesh pattern
  const gridSize = 60; // 60x60 grid
  const count = gridSize * gridSize;
  const spacing = 0.6;
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color(particleColor);
    
    let i = 0;
    for (let ix = 0; ix < gridSize; ix++) {
      for (let iz = 0; iz < gridSize; iz++) {
        // Centered grid on X and Z
        const x = (ix - gridSize / 2) * spacing;
        const z = (iz - gridSize / 2) * spacing;
        
        // Initial y is 0
        positions[i * 3] = x;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = z;

        // Subtle random color variation
        const mixColor = color.clone().offsetHSL(0, 0, (Math.random() - 0.5) * 0.1);
        colors[i * 3] = mixColor.r;
        colors[i * 3 + 1] = mixColor.g;
        colors[i * 3 + 2] = mixColor.b;
        i++;
      }
    }
    return [positions, colors];
  }, [particleColor]);

  // Animate particles in a very slow, minimal wave
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime * 0.15; // EXTREMELY minimal/slow wave speed
    
    let i = 0;
    for (let ix = 0; ix < gridSize; ix++) {
      for (let iz = 0; iz < gridSize; iz++) {
        const x = (ix - gridSize / 2) * spacing;
        const z = (iz - gridSize / 2) * spacing;
        
        // Calculate smooth wave height based on x, z, and time
        const y = Math.sin(x * 0.2 + time) * 1.5 + Math.cos(z * 0.2 + time) * 1.5;
        
        positions[i * 3 + 1] = y;
        i++;
      }
    }
    
    // Tell Three.js to update the geometry
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Extremely slow minimal rotation
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={theme === 'dark' ? 0.35 : 0.6}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
};

const ThreeBackground = () => {
  const { theme, palette } = useThemeStore();

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 5, 20], fov: 60 }} // Pulled camera up and back to look over the wave
        dpr={[1, 2]} 
        gl={{ alpha: true }}
      >
        <Particles key={`${theme}-${palette}`} theme={theme} palette={palette} />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
