import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GameCanvasComponent } from '../game-canvas/game-canvas.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [CommonModule, GameCanvasComponent],
  templateUrl: './post-edit.component.html',
  styleUrl: './post-edit.component.css'
})
export class PostEditComponent implements OnInit {

  constructor(private route: ActivatedRoute) {

  }

  uuid: string | null = null;

  ngOnInit(): void {
    this.uuid = this.route.snapshot.paramMap.get('uuid');
  }

}
