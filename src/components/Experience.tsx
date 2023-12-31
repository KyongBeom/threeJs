import { Float, Line, OrbitControls, PerspectiveCamera, useScroll } from "@react-three/drei";
import React, { useMemo, useRef } from 'react';
import { Background } from "./Background";
import { Airplane } from "./Airplane";
import { Cloud } from "./Cloud";
import * as THREE from 'three';
import { useFrame } from "@react-three/fiber";


const LINE_NB_POINTS = 2000;
export const Experience = () => {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(-2, 0, -20),
      new THREE.Vector3(-3, 0, -30),
      new THREE.Vector3(0, 0, -40),
      new THREE.Vector3(5, 0, -50),
      new THREE.Vector3(7, 0, -60),
      new THREE.Vector3(0, 0, -70),
      new THREE.Vector3(0, 0, -80),
      new THREE.Vector3(0, 0, -90),
      new THREE.Vector3(0, 0, -100),
    ],
      false,
      "catmullrom",
      0.5)
  }, [])

  const linePoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < LINE_NB_POINTS; i++) {
      points.push(curve.getPoint(i / LINE_NB_POINTS));
    }
    return points;
  }, [curve]);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.2);
    shape.lineTo(0, 0.2);

    return shape;
  }, [curve]);


  const scroll = useScroll();

  const cameraGroup = useRef<THREE.Group | null>(null);
  const airplane = useRef<THREE.Group | null>(null);

  useFrame((_state, delta) => {
    if (cameraGroup.current && airplane.current) {
      const curPointIndex = Math.min(
        Math.round(scroll.offset * linePoints.length),
        linePoints.length - 1
      );
      const curPoint = linePoints[curPointIndex];
      const pointAhead =
        linePoints[Math.min(curPointIndex + 1, linePoints.length - 1)];

      const xDisplacement = (pointAhead.x - curPoint.x) * 80;

      // Math.PI / 2 -> LEFT
      // -Math.PI / 2 -> RIGHT

      const angleRotation =
        (xDisplacement < 0 ? 1 : -1) *
        Math.min(Math.abs(xDisplacement), Math.PI / 3);

      const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          airplane.current.rotation.x,
          airplane.current.rotation.y,
          angleRotation
        )
      );
      const targetCameraQuaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          cameraGroup.current.rotation.x,
          angleRotation,
          cameraGroup.current.rotation.z
        )
      );

      airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);
      cameraGroup.current.quaternion.slerp(targetCameraQuaternion, delta * 2);

      cameraGroup.current.position.lerp(curPoint, delta * 24);
    }
  });


  return (
    <>
      {/* <OrbitControls enableZoom={false} /> */}
      <group ref={cameraGroup}>
        <Background />
        <PerspectiveCamera position={[0, 0, 5]} fov={30} makeDefault />
        <group ref={airplane}>

          <Float floatIntensity={2} speed={2}>
            <Airplane rotation-y={Math.PI / 2} position-y={0.2} scale={[0.2, 0.2, 0.2]} />
          </Float>
        </group>
      </group>
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[-6, 1, -3]} />
      <Cloud opacity={0.5} scale={[0.2, 0.3, 0.4]} position={[1.5, -0.5, -2]} />
      <Cloud
        opacity={0.7}
        scale={[0.3, 0.3, 0.3]}
        position={[2, 4, -2]}
        rotation-y={Math.PI / 9}
      />
      {/* <group position-y={-2}>

        <Line
          points={linePoints}
          color={"white"}
          opacity={0.7}
          transparent
          lineWidth={16}
        />
      </group> */}
      <group position-y={-2}>

        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              },
            ]}
          />
          <meshStandardMaterial color={"white"} opacity={0.7} transparent />
        </mesh>
      </group>

      <Cloud
        opacity={0.7}
        scale={[0.4, 0.4, 0.4]}
        position={[1, -0.2, -12]}
        rotation-y={Math.PI / 9}
      />
      <Cloud opacity={0.7} scale={[0.5, 0.5, 0.5]} position={[-1, 1, -53]} />
      <Cloud opacity={0.3} scale={[0.8, 0.8, 0.8]} position={[0, 1, -100]} />

    </>
  );
};
