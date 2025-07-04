import * as THREE from 'three';
import { createTextLabel } from './createTextLabel';
import { createPlanet } from './createPlanet';

export function createClusters(clustersData: any[], scene: THREE.Scene) {
    const createdClusters = [];

    clustersData.forEach((clusterData) => {
        const clusterGroup = new THREE.Group();
        clusterGroup.position.set(...clusterData.centerPosition);

        const planets = clusterData.planets.map((planetData, i) =>
            createPlanet(clusterData.color, clusterData, planetData, i, clusterData.planets.length)
        );

        planets.forEach(p => clusterGroup.add(p));

        const label = createTextLabel(
            clusterData.name,
            [0, 0, 0],
            clusterData.color
        );
        label.userData = { isLabel: true };
        clusterGroup.add(label);

        scene.add(clusterGroup);

        createdClusters.push({
            group: clusterGroup,
            planets,
            data: clusterData,
            label
        });
    });

    return createdClusters;
}
