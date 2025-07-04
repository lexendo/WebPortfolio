import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { createStars } from "@/components/utils/createStars";
import {
    GALAXY_BACKGROUND_COLOR,
    clustersData
} from "@/components/data/galaxyConstants"
import {createClusters} from "@/components/utils/createClusters";

const Galaxy = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const clustersRef = useRef([]);
    const starsRef = useRef([]);
    const frameRef = useRef(null);

    const [clusters] = useState(clustersData)

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(GALAXY_BACKGROUND_COLOR, 45, 60);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 12);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(GALAXY_BACKGROUND_COLOR, 1);
        rendererRef.current = renderer;
        mountRef.current.appendChild(renderer.domElement);

        const stars = createStars();
        scene.add(stars);
        starsRef.current = stars;

        clustersRef.current = createClusters(clusters, scene)
        const light = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(light);

        const directional = new THREE.DirectionalLight(0xffffff, 0.5);
        directional.position.set(5, 5, 5);
        scene.add(directional);



        const animate = () => {
            frameRef.current = requestAnimationFrame(animate);

            const time = Date.now() * 0.001;

            if (starsRef.current) {
                starsRef.current.rotation.y += 0.0003;
                starsRef.current.rotation.x += 0.0001;
            }



            clustersRef.current.forEach((cluster, clusterIndex) => {
                cluster.group.rotation.y += 0.002;

                const clusterTime = time + clusterIndex * 2;
                cluster.group.position.y += Math.sin(clusterTime * 0.3) * 0.002;

                cluster.planets.forEach((planet, planetIndex) => {
                    planet.lookAt(camera.position);

                    const orbitTime = time * cluster.data.orbitSpeed + planet.userData.originalAngle;
                    planet.position.x = Math.cos(orbitTime) * planet.userData.orbitDistance;
                    planet.position.z = Math.sin(orbitTime) * planet.userData.orbitDistance;
                    planet.position.y = planet.userData.orbitHeight + Math.sin(orbitTime * 2) * 0.1;

                    const targetScale = planet.userData.hovered ? 1.3 : 1.0;
                    const currentScale = planet.scale.x;
                    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
                    planet.scale.set(newScale, newScale, newScale);

                    const glowChild = planet.children[0];
                    if (glowChild) {
                        glowChild.lookAt(camera.position);
                    }
                });


                if (cluster.label) {
                    cluster.label.lookAt(camera.position);
                    cluster.label.position.y = 2.5 + Math.sin(time * 0.5 + clusterIndex) * 0.2;
                }
            });

            renderer.render(scene, camera);
        };

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            const allPlanets = clustersRef.current.flatMap(cluster => cluster.planets);
            const intersects = raycaster.intersectObjects(allPlanets);

            allPlanets.forEach(planet => {
                planet.userData.hovered = false;
            });

            if (intersects.length > 0) {
                const planet = intersects[0].object;
                planet.userData.hovered = true;
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = 'default';
            }
        };

        const onClick = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const allPlanets = clustersRef.current.flatMap(cluster => cluster.planets);
            const intersects = raycaster.intersectObjects(allPlanets);

            if (intersects.length > 0) {
                const planet = intersects[0].object;
                const clusterName = planet.userData.name;
                const planetIndex = planet.userData.planetIndex;

                console.log(`Kliknul si na planétu ${planetIndex + 1} v zhluku: ${clusterName}`);
                alert(`Otváram ${clusterName} - položka ${planetIndex + 1}`);
            }
        };

        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('click', onClick);
        window.addEventListener('resize', onWindowResize);

        animate();

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }

            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            window.removeEventListener('resize', onWindowResize);

            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }

            // Cleanup Three.js objektov
            clustersRef.current.forEach(cluster => {
                cluster.planets.forEach(planet => {
                    if (planet.geometry) planet.geometry.dispose();
                    if (planet.material) planet.material.dispose();
                });
                if (cluster.label && cluster.label.material) {
                    if (cluster.label.material.map) cluster.label.material.map.dispose();
                    cluster.label.material.dispose();
                }
                if (cluster.label && cluster.label.geometry) cluster.label.geometry.dispose();
            });

            if (starsRef.current) {
                if (starsRef.current.geometry) starsRef.current.geometry.dispose();
                if (starsRef.current.material) starsRef.current.material.dispose();
            }

            if (renderer) {
                renderer.dispose();
            }
        };
    }, [clusters]);

    return (
        <div
            ref={mountRef}
            className="fixed inset-0 -z-10"
            style={{
                background: 'linear-gradient(45deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
                overflow: 'hidden'
            }}
        />
    );
};

export default Galaxy;