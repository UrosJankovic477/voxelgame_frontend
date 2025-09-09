import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Input, model, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { mat4, vec3, vec4 } from 'gl-matrix';
import rgba from 'color-rgba';
import { Renderer } from '../../webgl/renderer';
import { EMPTY, empty, filter, from, fromEvent, groupBy, GroupedObservable, iif, interval, map, merge, mergeMap, mergeScan, Observable, partition, skipWhile, switchMap, takeUntil, zip } from 'rxjs';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { ColorPickerComponent } from "../color-picker/color-picker.component";
import { VoxelBuildService } from '../../services/voxel-build.service';
import { RouterModule } from '@angular/router';
import { UploadService } from '../../services/upload.service';
import { selectLoginToken } from '../../store/auth/auth.selectors';
import { sceneReset, sceneSave, sceneSavePreview } from '../../store/scene/scene.actions';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environment';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-game-canvas',
  standalone: true,
  imports: [
    ColorPickerComponent, 
    RouterModule, 
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './game-canvas.component.html',
  styleUrl: './game-canvas.component.css'
})
export class GameCanvasComponent implements OnInit, OnChanges {

  constructor(
    private voxelBuildService: VoxelBuildService,
    private uploadService: UploadService,
    private store: Store<AppState>
  ) { }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    const uuid = changes['postUuid'].currentValue;
    
    if (!uuid) {
      console.warn('No post UUID provided.');
      this.scene = null;
    }
    else {
      this.scene = await fetch(`${environment.api}/uploads/posts/${uuid}.json`).then(response => response.text());
    }
    this.canvas = this.canvas = document.querySelector('#c');
    this.viewOnly = changes['viewOnly'].currentValue;
    this.initRenderer();
    this.renderer?.createScene({
      scene: this.scene
    });
  }

  @Input() postUuid: string | null = null;
  @Input() viewOnly: boolean = false;
  @Input() editMode: boolean = false;

  scene: string | null = null;

  canvas: HTMLCanvasElement | null = null;

  renderer: Renderer | null = null;

  mouseEvent$?: Observable<MouseEvent>;
  wheelEvent$?: Observable<WheelEvent>;
  keydownEvent$?: Observable<KeyboardEvent>;
  keyupEvent$?: Observable<KeyboardEvent>;
  clickEvent$?: Observable<MouseEvent>;

  color: vec4 = vec4.fromValues(0, 0, 0, 255);

  
  public get saveFormRoute() : string {
    return '/post-save-form/' + (this.postUuid ?? '');
  }
  

  saveScene() {
    this.renderer?.saveScene();
    this.savePreview();
  }

  initEvents() {
    this.keydownEvent$ = fromEvent(document, 'keydown') as Observable<KeyboardEvent>;
    this.keyupEvent$ = fromEvent(document, 'keyup') as Observable<KeyboardEvent>;
    this.mouseEvent$ = fromEvent(this.canvas!, 'mousemove') as Observable<MouseEvent>;
    this.wheelEvent$ = fromEvent(document, 'wheel') as Observable<WheelEvent>;
    this.clickEvent$ = fromEvent(this.canvas!, 'click') as Observable<MouseEvent>;

    this.clickEvent$.subscribe((ev: MouseEvent) => {
      const boundingRect = this.canvas!.getBoundingClientRect();
      const x = (ev.clientX - boundingRect.x);
      const y = boundingRect.height - (ev.clientY - boundingRect.y);

      const collisionData = this.renderer!.testCollision(x, y);
      let intersection = collisionData.intersection;
      if (!collisionData.collision 
        || intersection![0] < -this.renderer!.scene!.size / 2
        || intersection![0] > this.renderer!.scene!.size / 2
        || intersection![1] < 0
        || intersection![1] > this.renderer!.scene!.size
        || intersection![2] < -this.renderer!.scene!.size / 2
        || intersection![2] > this.renderer!.scene!.size / 2) {
        return;
      }

      let color: vec4 | null = this.color;
      
      if (!ev.shiftKey) {
        if (collisionData.normal!) {
          vec4.scaleAndAdd(intersection!, intersection!, collisionData.normal, 0.9);
        }

      }
      else {
        vec4.scaleAndAdd(intersection!, intersection!, collisionData.delta!, 0.5);
        color = null;
      }
      if (!this.viewOnly) {
        vec4.floor(intersection!, intersection!);
        this.renderer?.changeBlock(intersection!.slice(0, 3) as vec3, color);
      }
      
    }); 
    
    this.mouseEvent$.pipe(
      filter(ev => {
        return (ev.buttons & 4) !== 0; 
      })
    ).subscribe((ev: MouseEvent) => {
      //if (!this.canvas?.focus) {
      //  return;
      //}
      this.renderer?.translateCamera(ev.movementX, -ev.movementY);
    });

    this.wheelEvent$.pipe(
      map(ev => -ev.deltaY * 10)
    ).subscribe(delta => {
      //if (!this.canvas?.matches(':focus')) {
      //  return;
      //}
      this.renderer?.zoomCamera(delta)

    });

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
    ).subscribe(angles => {
      //if (!this.canvas?.matches(':focus')) {
      //  return;
      //}
      this.renderer?.rotateCamera(angles[0], angles[1])
    });
  }

  initCanvas() {
    this.canvas = document.querySelector('#c');
    if (this.canvas === null) {
      throw new Error('Failed to find WebGL canvas');
    }

    document.addEventListener('click', ev => {
      const boundingRect = this.canvas?.getBoundingClientRect();
      if (ev.clientX < boundingRect!.left || ev.clientX > boundingRect!.right || ev.clientY > boundingRect!.bottom || ev.clientY < boundingRect!.top) {
        this.canvas?.blur();
        
      }
      else {
        this.canvas?.focus();
      }
    })

    this.canvas.addEventListener('mousedown', ev => {
      ev.preventDefault();
    });

    this.canvas.addEventListener('contextmenu', ev => {
      ev.preventDefault();
    });

    this.canvas.addEventListener('wheel', ev => {
      ev.preventDefault();
    });

  }

  init() {
    this.initCanvas();
    this.initEvents();
    this.initRenderer();
  }

  ngOnInit(): void {
    this.init();
  }

  initRenderer() {
    this.renderer = new Renderer(this.canvas!, this.store, {
      backgroundColor: 'aliceblue',
      size: 16,
      gridColor: 'crimson',
      scene: this.scene
    });
    this.renderer.loadScene();
    this.renderer.render();
  }

  changeColor($event: string) {


    const redHex = $event.slice(1, 3);
    const greenHex = $event.slice(3, 5);
    const blueHex = $event.slice(5);

    const color = vec4.fromValues(
      Number(`0X${redHex}`),
      Number(`0X${greenHex}`),
      Number(`0X${blueHex}`),
      255
    )

    if (!this.color) {
      this.color = vec4.clone(color);
    }
    else {
      vec4.copy(this.color, color);
    }
  }

  savePreview() {
    this.renderer?.render();
    try {
      this.canvas?.toBlob((blob) => {
        if (blob == null) {
          throw new Error("Couldn't save preview");
        }
        const previewUrl = URL.createObjectURL(blob);
        this.store.dispatch(sceneSavePreview({ preview: blob, previewLocal: previewUrl ?? ''}));
      }, 'image/png')
    } catch (error) {
      console.error(error);
      
    }
  }

  resetScene() {
    this.store.dispatch(sceneReset());
    this.initRenderer();
  }

}
