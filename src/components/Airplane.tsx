import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { AirplaneProps } from './AirplaneProps';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const HELIX_SPEED = 6;
export function Airplane(props: AirplaneProps) {
    const { nodes, materials } = useGLTF('./models/airplane/model.glb') as any;


    const helix = useRef(undefined);

    useFrame((_state, delta) => {
        console.log(helix)
        if (helix.current) {
            helix.current.rotation.x += delta * HELIX_SPEED;
        }
    })

    return (
        <group {...props} dispose={null} scale={[0.2, 0.2, 0.2]}>
            <mesh 
            geometry={nodes.PUSHILIN_Plane_Circle000.geometry} 
            material={materials.plane} />
            <mesh
                ref={helix}
                geometry={nodes.PUSHILIN_Plane_Helix.geometry}
                material={materials.plane}
                position={[1.09, 0.23, 0]} 
                />
        </group>
    );
}

useGLTF.preload("./models/airplane/model.glb");