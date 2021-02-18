import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Camera, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from '@jsm/controls/OrbitControls';
import Stats from '@jsm/libs/stats.module';
import { GUI } from '@jsm/libs/dat.gui.module';

@Component({
  selector: 'app-three',
  templateUrl: './three.component.html',
  styleUrls: ['./three.component.scss']
})
export class ThreeComponent implements OnInit, OnChanges {

  private control?: OrbitControls;
  private renderer = new WebGLRenderer();


  @Input() scene = new Scene();
  @Input() camera: Camera = new PerspectiveCamera();
  @Input() stats?: Stats;
  @Input() gui?: GUI;
  @Input() controls = false;
  @Input() animatefn: () => void = () => { };

  constructor(
    private elementRef: ElementRef<HTMLElement>
  ) {
    this.renderer.setSize(elementRef.nativeElement.offsetWidth, elementRef.nativeElement.offsetHeight);
    elementRef.nativeElement.appendChild(this.renderer.domElement);
  }

  ngOnInit(): void {
    this.resizeCamera();
    this.updateRendererSize();

    this.stats && this.elementRef.nativeElement.appendChild(this.stats.dom);

    this.control = this.controls ? new OrbitControls(this.camera, this.elementRef.nativeElement) : undefined;

    this.animate();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.stats && changes.stats.currentValue !== changes.stats.previousValue) {
      this.updateStats(changes.stats.currentValue, changes.stats.previousValue);
    }
  }


  private animate = () => {
    requestAnimationFrame(this.animate);
    this.animatefn();
    this.control && this.control.update();
    this.stats && this.stats.update();
    this.render();
  }

  private updateStats(current?: Stats, previous?: Stats): void {
    if (previous) {
      this.elementRef.nativeElement.removeChild(previous.dom);

    }
    if (current) {
      this.elementRef.nativeElement.appendChild(current.dom);
    }
  }

  private updateRendererSize() {
    this.renderer.setSize(this.elementRef.nativeElement.offsetWidth, this.elementRef.nativeElement.offsetHeight);
  }

  private resizeCamera(): void {
    if (this.camera instanceof PerspectiveCamera) {
      this.camera.aspect = this.elementRef.nativeElement.offsetWidth / this.elementRef.nativeElement.offsetHeight;
      this.camera.updateProjectionMatrix();
    }

    if (this.camera instanceof OrthographicCamera) {
      console.warn("NEED TO CREATE RESIZE FOR ORTHO CAMERA");
      this.camera.updateProjectionMatrix();
    }
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  @HostListener('window:resize')
  onResize(): void {

    this.updateRendererSize();
    this.resizeCamera();
    this.render();
  }

}
