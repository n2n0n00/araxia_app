import React, { useRef, useEffect } from "react";
import { View } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";

const TopUsers = () => {
  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // Renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = -4;

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    // Cone geometry (similar to cylinder but with a cone shape)
    const geometry = new THREE.CylinderGeometry(1, 0.9, 1, 32); // Top radius 0 to form a cone
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const cone = new THREE.Mesh(geometry, material);
    scene.add(cone);

    // Render the scene once
    renderer.render(scene, camera);
    gl.endFrameEXP();
  };

  return (
    <View style={{ flex: 1 }}>
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
    </View>
  );
};

export default TopUsers;
