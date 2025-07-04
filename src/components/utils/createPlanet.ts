import * as THREE from 'three';
import { PLANET_SETTINGS } from '@/components/data/galaxyConstants';

export function createPlanet(clusterColor: number, clusterData: any, planetData: any, index: number, total: number) {
    const textureLoader = new THREE.TextureLoader();
    const iconUrl = planetData.image || '/default_image.png';

    const texture = textureLoader.load(
        iconUrl,
        (texture) => {
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;

            texture.generateMipmaps = true;
            texture.anisotropy = 16;
        },
        undefined,
        (error) => {
            console.warn(`Nepodarilo sa načítať textúru: ${iconUrl}`, error);
        }
    );

    const geometry = new THREE.CircleGeometry(
        PLANET_SETTINGS.radius,
        64
    );

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
        alphaTest: 0.1,
        depthWrite: false,
        depthTest: true
    });

    const planet = new THREE.Mesh(geometry, material);

    const angle = (index / total) * Math.PI * 2;
    const distance = clusterData.orbitRadius * (0.7 + Math.random() * 0.6);
    const height = (Math.random() - 0.5) * 0.5;

    planet.position.set(
        Math.cos(angle) * distance,
        height,
        Math.sin(angle) * distance
    );

    planet.userData = {
        ...clusterData,
        planetIndex: index,
        originalAngle: angle,
        orbitDistance: distance,
        orbitHeight: height,
        name: planetData.name
    };

    const glowGeometry = new THREE.RingGeometry(
        PLANET_SETTINGS.radius * 1.1,
        PLANET_SETTINGS.radius * 1.8,
        32
    );

    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 64;
    glowCanvas.height = 64;
    const glowContext = glowCanvas.getContext('2d')!;

    const gradient = glowContext.createRadialGradient(32, 32, 0, 32, 32, 32);
    const colorHex = `#${clusterColor.toString(16).padStart(6, '0')}`;
    gradient.addColorStop(0, colorHex + '80');
    gradient.addColorStop(0.5, colorHex + '40');
    gradient.addColorStop(1, colorHex + '00');

    glowContext.fillStyle = gradient;
    glowContext.fillRect(0, 0, 64, 64);

    const glowTexture = new THREE.CanvasTexture(glowCanvas);

    const glowMaterial = new THREE.MeshBasicMaterial({
        map: glowTexture,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    planet.add(glow);

    return planet;
}