import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Intelligent mapping from pet type & name to actual 3D rigged models
export function resolveModelUrl(petType = "", petName = "") {
  const typeStr = (petType || "").toLowerCase();
  const nameStr = (petName || "").toLowerCase();
  const combined = `${typeStr} ${nameStr}`;

  if (combined.includes("dragon") || combined.includes("rồng") || combined.includes("rong")) {
    return "/models/dragon.glb";
  }
  if (combined.includes("dog") || combined.includes("cún") || combined.includes("cun") || combined.includes("chó") || combined.includes("corgi")) {
    return "/models/dog.glb";
  }
  if (combined.includes("panda") || combined.includes("gấu") || combined.includes("gau")) {
    return "/models/panda.glb";
  }
  if (combined.includes("horse") || combined.includes("ngựa") || combined.includes("ngua")) {
    return "/models/horse.glb";
  }
  if (combined.includes("duck") || combined.includes("vịt") || combined.includes("vit")) {
    return "/models/duck.glb";
  }
  if (combined.includes("parrot") || combined.includes("vẹt") || combined.includes("vet")) {
    return "/models/parrot.glb";
  }
  if (combined.includes("flamingo") || combined.includes("hồng hạc") || combined.includes("hong hac")) {
    return "/models/flamingo.glb";
  }
  if (combined.includes("stork") || combined.includes("cò") || combined.includes("co")) {
    return "/models/stork.glb";
  }
  if (combined.includes("fox") || combined.includes("cáo") || combined.includes("cao")) {
    return "/models/fox.glb";
  }

  return "/models/fox.glb";
}

/**
 * Pet3DCanvas - Real 3D Skeletal Rigged Animals via Three.js GLTFLoader
 * Features:
 * - Perfectly auto-framed, centered, and scaled 3D animal models
 * - Real animation clips (Idle / Survey / Walk / Run) from Blender
 * - 360° touch/mouse orbit interaction
 * - Cinematic studio lighting with real-time soft shadows
 */
export default function Pet3DCanvas({
  petType = "fox",
  petName = "",
  action = "idle",
  activeHat = null,
  onPetClick,
  actionTrigger = 0,
}) {
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const stateRef = useRef({
    currentAction: "idle",
    actionTimer: 0,
    isDragging: false,
    prevMouseX: 0,
    targetRotationY: 0.35, // Initial natural 3/4 angle
    currentRotationY: 0.35,
    mixer: null,
    actionsMap: {},
    currentClipName: null,
    pivotRoot: null
  });

  // Track action triggers and switch animation clips
  useEffect(() => {
    stateRef.current.currentAction = action;
    stateRef.current.actionTimer = 0;

    const { actionsMap, mixer } = stateRef.current;
    if (!mixer || Object.keys(actionsMap).length === 0) return;

    let targetClip = null;
    const availableClips = Object.keys(actionsMap);

    if (availableClips.includes("Survey") || availableClips.includes("Walk") || availableClips.includes("Run")) {
      if (action === "idle") {
        targetClip = "Survey";
      } else if (action === "pet") {
        targetClip = "Survey";
      } else if (action === "jump" || action === "play") {
        targetClip = "Run";
      } else if (action === "eat") {
        targetClip = "Walk";
      }
    } else {
      targetClip = availableClips[0];
    }

    if (targetClip && actionsMap[targetClip]) {
      const prevAction = stateRef.current.currentClipName ? actionsMap[stateRef.current.currentClipName] : null;
      const nextAction = actionsMap[targetClip];

      if (prevAction && prevAction !== nextAction) {
        prevAction.fadeOut(0.3);
      }
      nextAction.reset().fadeIn(0.3).play();

      if (action === "pet") {
        nextAction.setEffectiveTimeScale(0.8);
      } else if (action === "jump" || action === "play") {
        nextAction.setEffectiveTimeScale(1.35);
      } else {
        nextAction.setEffectiveTimeScale(1.0);
      }

      stateRef.current.currentClipName = targetClip;
    }
  }, [action, actionTrigger]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    setIsLoading(true);

    // 1. Scene & Setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 320;

    // Camera positioned at eye level for dramatic, clear view
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfffbeb, 1.8);
    scene.add(ambientLight);

    // Key Light (warm sunlight)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(3.5, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill Light (soft sky tone)
    const fillLight = new THREE.DirectionalLight(0xbae6fd, 1.2);
    fillLight.position.set(-3.5, 2.5, -2);
    scene.add(fillLight);

    // Rim Light (edge highlight on fur)
    const rimLight = new THREE.DirectionalLight(0xfef08a, 1.4);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // 3. Floating Grass Island & Shadow
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);

    // Thin elegant podium placed strictly underneath feet
    const podiumGeo = new THREE.CylinderGeometry(1.25, 1.1, 0.14, 36);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.55,
      metalness: 0.05
    });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.y = -0.72;
    podium.receiveShadow = true;
    islandGroup.add(podium);

    // Top soft grass layer
    const grassTopGeo = new THREE.CylinderGeometry(1.27, 1.27, 0.04, 36);
    const grassTopMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.4 });
    const grassTop = new THREE.Mesh(grassTopGeo, grassTopMat);
    grassTop.position.y = -0.64;
    grassTop.receiveShadow = true;
    islandGroup.add(grassTop);

    // Soft ground contact shadow
    const shadowGeo = new THREE.CircleGeometry(1.0, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.28
    });
    const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = -0.61;
    islandGroup.add(groundShadow);

    // 4. Load & Auto-Frame 3D Animal Model
    const modelUrl = resolveModelUrl(petType, petName);
    const loader = new GLTFLoader();

    // Pivot root that handles rotation & jumping
    const pivot = new THREE.Group();
    scene.add(pivot);
    stateRef.current.pivotRoot = pivot;

    loader.load(
      modelUrl,
      (gltf) => {
        setIsLoading(false);
        const model = gltf.scene;

        // Calculate true bounding box
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Target size: 2.35 units in viewport (large, crisp and prominent)
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 2.35 / (maxDim || 1);

        // Center model geometry exactly at origin
        model.position.set(-center.x, -center.y, -center.z);

        // Wrapper to apply uniform scale
        const modelWrapper = new THREE.Group();
        modelWrapper.add(model);
        modelWrapper.scale.setScalar(targetScale);

        // Calculate bottom feet offset so feet stand firmly on the grass (-0.62)
        const feetYOffset = (center.y - box.min.y) * targetScale;
        modelWrapper.position.y = -0.62 + feetYOffset;

        // Enhance materials and cast shadows
        model.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            if (node.material) {
              node.material.roughness = Math.min(0.75, node.material.roughness || 0.6);
            }
          }
        });

        pivot.add(modelWrapper);

        // Setup Animation Mixer
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          stateRef.current.mixer = mixer;

          const actionsMap = {};
          gltf.animations.forEach((clip) => {
            actionsMap[clip.name] = mixer.clipAction(clip);
          });
          stateRef.current.actionsMap = actionsMap;

          // Default idle animation: Survey / Idle
          const defaultClip = actionsMap["Survey"] || actionsMap[gltf.animations[0].name];
          if (defaultClip) {
            defaultClip.play();
            stateRef.current.currentClipName = defaultClip.getClip().name;
          }
        }
      },
      undefined,
      (error) => {
        console.error("Failed to load 3D GLTF model:", error);
        setIsLoading(false);
      }
    );

    // 5. Smooth Drag / Touch 360° Orbit Interaction
    const handlePointerDown = (e) => {
      stateRef.current.isDragging = true;
      stateRef.current.prevMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    };

    const handlePointerMove = (e) => {
      if (!stateRef.current.isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const deltaX = clientX - stateRef.current.prevMouseX;
      stateRef.current.targetRotationY += deltaX * 0.018;
      stateRef.current.prevMouseX = clientX;
    };

    const handlePointerUp = () => {
      stateRef.current.isDragging = false;
    };

    container.addEventListener("mousedown", handlePointerDown);
    container.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchend", handlePointerUp);

    // 6. 60 FPS Animation & Render Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Update skeletal bone animations
      if (stateRef.current.mixer) {
        stateRef.current.mixer.update(delta);
      }

      // Smooth 360° rotation lerp
      stateRef.current.currentRotationY = THREE.MathUtils.lerp(
        stateRef.current.currentRotationY,
        stateRef.current.targetRotationY,
        0.12
      );
      pivot.rotation.y = stateRef.current.currentRotationY;

      // Gentle floating motion
      islandGroup.position.y = Math.sin(time * 2.2) * 0.035;
      groundShadow.scale.setScalar(1 - Math.sin(time * 2.2) * 0.08);

      // Bounce reaction on jump / play
      if (stateRef.current.currentAction === "jump" || stateRef.current.currentAction === "play") {
        const jumpH = Math.abs(Math.sin(time * 9)) * 0.25;
        pivot.position.y = jumpH;
      } else {
        pivot.position.y = THREE.MathUtils.lerp(pivot.position.y, 0, 0.1);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", handlePointerDown);
      container.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchend", handlePointerUp);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [petType, petName]);

  return (
    <div
      ref={mountRef}
      onClick={onPetClick}
      style={{
        width: "100%",
        height: "320px",
        position: "relative",
        cursor: "grab",
        touchAction: "none",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      title="Bé vuốt ngón tay để xoay 360° hoặc chạm để chơi cùng bạn nhé!"
    >
      {isLoading && (
        <div style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          color: "#059669",
          fontWeight: 800,
          fontSize: "13px",
          pointerEvents: "none"
        }}>
          <div className="animate-spin" style={{
            width: "32px",
            height: "32px",
            border: "3px solid #bbf7d0",
            borderTopColor: "#16a34a",
            borderRadius: "50%"
          }} />
          <span>Đang đánh thức bạn thú 3D... ✨</span>
        </div>
      )}
    </div>
  );
}
