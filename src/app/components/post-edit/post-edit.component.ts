import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { GameCanvasComponent } from '../game-canvas/game-canvas.component';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [CommonModule, GameCanvasComponent],
  templateUrl: './post-edit.component.html',
  styleUrl: './post-edit.component.css'
})
export class PostEditComponent implements OnInit, AfterViewInit {

  constructor(public route: ActivatedRoute) {
    
  }
  ngAfterViewInit(): void {
  }

  uuid: string | null = null;
  @ViewChild(GameCanvasComponent, {

  }) gameCanvas!: GameCanvasComponent;

  ngOnInit(): void {
    
  }


}
