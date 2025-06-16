import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { vec4 } from 'gl-matrix';
import { EMPTY, Observable } from 'rxjs';
import rgba from 'color-rgba';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.css'
})
export class ColorPickerComponent implements OnInit {
  
  constructor(private store: Store<AppState>) {

  }

  @Output()
  changeColorEvent = new EventEmitter<string>();

  ngOnInit(): void {

  }

  onChangeColor(event: Event) {
    const input = document.getElementById('color-picker');
    const color = (input as HTMLInputElement).value;
    this.changeColorEvent.emit(color);
  }

}
