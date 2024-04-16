import React, { Component } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

// Composant principal de l'application
export default class App extends Component {
    state = {
        isAnimating: false, // État pour suivre si l'animation est active ou non
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <GLView style={{ flex: 1 }} onContextCreate={this._onGLContextCreate} />
                <View style={styles.buttonContainer}>
                    <Button
                        title={this.state.isAnimating ? 'Stop' : 'Animer le pyramide'}
                        onPress={this.toggleAnimation}
                    />
                </View>
            </View>
        );
    }

    toggleAnimation = () => {
        this.setState((prevState) => ({
            isAnimating: !prevState.isAnimating, // Bascule l'état de l'animation
        }));
    };

    _onGLContextCreate = async (gl) => {
        // Initialisation
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
        camera.position.set(0, 0, 5);
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

        // Ajout d'éclairage
        const ambientLight = new THREE.AmbientLight(0x101010);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 0);
        scene.add(directionalLight);

        // Création et ajout d'un objet 3D (pyramide)
        const radius = 1; // Rayon de la base de la pyramide
        const height = 3; // Hauteur de la pyramide
        const radialSegments = 4; // Nombre de segments autour de la base (pyramide à base carrée)

        const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const pyramid = new THREE.Mesh(geometry, material);
        scene.add(pyramid);

        // Fonction d'animation
        const animate = () => {
            // Si l'état `isAnimating` est true, anime la pyramide
            if (this.state.isAnimating) {
                pyramid.rotation.x += 0.01;
                pyramid.rotation.y += 0.01;
                renderer.render(scene, camera);
            } else {
                // Sinon, affiche simplement la pyramide sans l'animer
                renderer.render(scene, camera);
            }
            
            // Réappelle `animate` pour la prochaine frame
            requestAnimationFrame(animate);
            
            // Fin de l'animation
            gl.endFrameEXP();
        };

        // Démarrer l'animation (y compris l'affichage initial de la pyramide)
        animate();
    };
}

// Styles pour le composant
const styles = StyleSheet.create({
    buttonContainer: {
        margin: 20, 
        width: '80%',
        height: 20,
        alignSelf: 'center',
    },
});
