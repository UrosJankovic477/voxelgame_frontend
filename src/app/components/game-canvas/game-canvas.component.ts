import { HttpClient } from '@angular/common/http';
import { Component, HostListener, model, OnInit } from '@angular/core';
import { mat4, vec3, vec4 } from 'gl-matrix';
import { Mesh } from '../../models/webgl-models/mesh.model';
import { Camera } from '../../models/webgl-models/camera.model';
import rgba from 'color-rgba';
import { Renderer } from '../../models/webgl-models/renderer.model';
import { EMPTY, empty, filter, from, fromEvent, groupBy, GroupedObservable, iif, interval, map, merge, mergeMap, mergeScan, Observable, partition, skipWhile, switchMap, takeUntil, zip } from 'rxjs';


// refactor: separate render related code from component class

@Component({
  selector: 'app-game-canvas',
  standalone: true,
  imports: [],
  templateUrl: './game-canvas.component.html',
  styleUrl: './game-canvas.component.css'
})
export class GameCanvasComponent implements OnInit {
  

  constructor(private client: HttpClient) { }

  canvas: HTMLCanvasElement | null = null;

  renderer: Renderer | null = null;

  mouseEvent$?: Observable<MouseEvent>;
  wheelEvent$?: Observable<WheelEvent>;
  keydownEvent$?: Observable<KeyboardEvent>;
  keyupEvent$?: Observable<KeyboardEvent>;

  private dx: number = 0;
  private dy: number = 0;

  ngOnInit(): void {
    this.canvas = document.querySelector('#c');
    if (this.canvas === null) {
      throw new Error('Failed to find WebGL canvas');
    }

    this.canvas.addEventListener('mousedown', ev => {
      ev.preventDefault();
    });

    this.canvas.addEventListener('contextmenu', ev => {
      ev.preventDefault();
    });
    this.keydownEvent$ = fromEvent(document, 'keydown') as Observable<KeyboardEvent>;
    this.keyupEvent$ = fromEvent(document, 'keyup') as Observable<KeyboardEvent>;
    this.mouseEvent$ = fromEvent(this.canvas, 'mousemove') as Observable<MouseEvent>;
    this.wheelEvent$ = fromEvent(document, 'wheel') as Observable<WheelEvent>;
    this.mouseEvent$.pipe(
      filter(ev => {
        return (ev.buttons & 4) !== 0; 
      })
    ).subscribe((ev: MouseEvent) => {
      this.renderer?.translateCamera(ev.movementX, -ev.movementY);
    });

    this.wheelEvent$.pipe(
      map(ev => -ev.deltaY * 10)
    ).subscribe(delta => this.renderer?.zoomCamera(delta));

    this.keydownEvent$.pipe(
      switchMap(keyDown => {
        let stream$
        switch (keyDown.code) {
          case 'KeyW': {
            stream$ = interval(10).pipe(
              map(x => [-1, 0])
            ); 
            break;
          }
          case 'KeyA': {
              stream$ = interval(10).pipe(
              map(x => [0, 1])
            ); 
            break;
          }
          case 'KeyS': {
            stream$ = interval(10).pipe(
              map(x => [1, 0])
            );
            break;
          }
          case 'KeyD': {
              stream$ = interval(10).pipe(
              map(x => [0, -1])
            ); 
            break;
          }
          default: return stream$ = EMPTY;
        }

        return stream$.pipe(
          takeUntil(this.keyupEvent$!.pipe(
            filter(keyUp => keyDown.code == keyUp.code)
          )),
          map(angles => [
            angles[0] / 180 * Math.PI,
            angles[1] / 180 * Math.PI,
          ])
        );
      }), 
    ).subscribe(angles => this.renderer?.rotateCamera(angles[0], angles[1]));

    
    
    this.renderer = new Renderer(this.canvas, {
      backgroundColor: 'DeepSkyBlue',
      gridWidth: 16,
      gridColor: 'RosyBrown'
    });
    this.renderer.loadScene();
    this.renderer.render();
  }

}
