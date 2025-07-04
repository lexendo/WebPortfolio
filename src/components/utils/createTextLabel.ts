import * as THREE from 'three';
import {LABEL_SETTINGS} from "@/components/data/galaxyConstants";

/**
 * Create text labes as a 2D text.
 * @param text Text na zobrazenie
 * @param position Trojrozmerná pozícia [x, y, z]
 * @param color Hex farba (napr. 0xff0000)
 * @returns THREE.Mesh s textúrou
 */
export function createTextLabel(
    text: string,
    position: [number, number, number],
    color: number
): THREE.Mesh {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 512;
    canvas.height = 128;

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.font = `bold ${LABEL_SETTINGS.fontSize}px Arial`
    context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.shadowColor = `#${color.toString(16).padStart(6, '0')}`;
    context.shadowBlur = 20;

    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9
    });

    const geometry = new THREE.PlaneGeometry(4, 1);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position[0], position[1] + 1, position[2]);

    return mesh;
}
