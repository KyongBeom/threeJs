import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { MeshStandardMaterial } from 'three';
import { OpacityProps } from './OpacityProps';
import { CloudProps } from './CloudProps';
import { Vector3 } from 'three'; // Vector3 타입 추가


export function Cloud(props: CloudProps & OpacityProps) {
    const { nodes, materials } = useGLTF('./models/cloud/model.glb') as any;
    const position: Vector3 = new Vector3(props.position[0], props.position[1], props.position[2]); // number[]을 Vector3로 변환

    return (
        <group dispose={null}>
            <group position={position}>
                <mesh geometry={nodes.Node.geometry}>
                    <meshStandardMaterial
                        {...materials["lambert2SG.001"]}
                        transparent
                        opacity={props.opacity}
                    />
                </mesh>
            </group>
        </group>
    )
}

useGLTF.preload('./models/cloud/model.glb')