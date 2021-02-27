import { Component, ElementRef } from '@angular/core';
import { GUI } from '@jsm/libs/dat.gui.module';
import { AxesHelper, BoxGeometry, Camera, Material, Mesh, MeshBasicMaterial, MeshNormalMaterial, PerspectiveCamera, Scene } from 'three';
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
    const material = new MeshBasicMaterial();
    // const material = new MeshNormalMaterial();

    const cubeFolder = this.gui.addFolder("Cube");

    const cubeData = {
      width: 1,
      height: 1,
      depth: 1,
      widthSegments: 1,
      heightSegments: 1,
      depthSegments: 1
    };

    const materialFolder = this.gui.addFolder("Material");
    materialFolder.add(material, 'transparent');
    materialFolder.add(material, 'opacity', 0, 1, 0.01);
    materialFolder.add(material, 'opacity', 0, 1, 0.01);
    materialFolder.add(material, 'depthWrite');
    materialFolder.add(material, 'alphaTest', 0, 1, 0.01).onChange(() => this.updateMaterial(material));
    materialFolder.add(material, 'visible');
    // materialFolder.add(material, 'side', options.side)

    const cubePropertiesFolder = cubeFolder.addFolder("Properties");
    cubePropertiesFolder.add(cubeData, 'width', 1, 30).onChange(() => this.generateCubeGeometry(cubeData, cube));
    cubePropertiesFolder.add(cubeData, 'height', 1, 30).onChange(() => this.generateCubeGeometry(cubeData, cube));
    cubePropertiesFolder.add(cubeData, 'depth', 1, 30).onChange(() => this.generateCubeGeometry(cubeData, cube));
    cubePropertiesFolder.add(cubeData, 'widthSegments', 1, 30).onChange(() => this.generateCubeGeometry(cubeData, cube));
    cubePropertiesFolder.add(cubeData, 'heightSegments', 1, 30).onChange(() => this.generateCubeGeometry(cubeData, cube));
    cubePropertiesFolder.add(cubeData, 'depthSegments', 1, 30).onChange(() => this.generateCubeGeometry(cubeData, cube));

    const cube = new Mesh(geometry, material);
    const axesHelper = new AxesHelper(2);

    this.scene.add(cube);
    this.scene.add(axesHelper);

    this.camera = new PerspectiveCamera(50, 1, 0.01, 10000);
    this.camera.position.z = 5;

    this.animatefn = () => {
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;

      this.stats.update();
    };

    const cubeRotationFolder = this.gui.addFolder("Rotation");
    cubeRotationFolder.add(cube.rotation, 'x', 0, Math.PI * 2, 0.1);
    cubeRotationFolder.add(cube.rotation, 'y', 0, Math.PI * 2, 0.1);
    cubeRotationFolder.add(cube.rotation, 'z', 0, Math.PI * 2, 0.1);
    cubeRotationFolder.open();

    const cubePositionFolder = this.gui.addFolder("Position");
    cubePositionFolder.add(cube.position, 'x', -2, 2);
    cubePositionFolder.add(cube.position, 'y', -2, 2);
    cubePositionFolder.add(cube.position, 'z', -2, 2);
    cubePositionFolder.open();

    const cubeScaleFolder = this.gui.addFolder("Scale");
    cubeScaleFolder.add(cube.scale, 'x', 0.1, 5, 0.1);
    cubeScaleFolder.add(cube.scale, 'y', 0.1, 5, 0.1);
    cubeScaleFolder.add(cube.scale, 'z', 0.1, 5, 0.1);
    cubeScaleFolder.open();

    cubeFolder.add(cube, 'visible', true);
    cubeFolder.open();

    const cameraFolder = this.gui.addFolder("Camera");
    cameraFolder.add(this.camera.position, 'z', 0, 10);
    cameraFolder.open();
  }

  generateCubeGeometry(cubeData: any, cube: Mesh): void {
    const newGeometry = new BoxGeometry(cubeData.width, cubeData.height, cubeData.depth, cubeData.widthSegments, cubeData.heightSegments, cubeData.depthSegments);

    cube.geometry.dispose();
    cube.geometry = newGeometry;
  }

  updateMaterial(material: Material): void {
    material.side = Number(material.side);
    material.needsUpdate = true;
  }
}
