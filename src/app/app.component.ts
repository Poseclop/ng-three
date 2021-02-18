import { Component, ElementRef } from '@angular/core';
import { GUI } from '@jsm/libs/dat.gui.module';
import { BoxGeometry, Camera, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-threejs';

  scene = new Scene();
  camera: Camera;
  animatefn: () => void;
  stats = Stats();
  gui = new GUI();

  constructor(elementRef: ElementRef) {
    const geometry = new BoxGeometry;
    const material = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const cube = new Mesh(geometry, material);

    this.scene.add(cube);

    this.camera = new PerspectiveCamera(50, 1, 0.01, 10000);
    this.camera.position.z = 5;

    this.animatefn = () => {
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;

      this.stats.update();
    };

    const cubeFolder = this.gui.addFolder("Cube");
    cubeFolder.add(cube.rotation, 'x', 0, Math.PI * 2);
    cubeFolder.add(cube.rotation, 'y', 0, Math.PI * 2);
    cubeFolder.add(cube.rotation, 'z', 0, Math.PI * 2);
    cubeFolder.open();

    const cameraFolder = this.gui.addFolder("Camera");
    cameraFolder.add(this.camera.position, 'z', 0, 10);
    cameraFolder.open();
  }
}
