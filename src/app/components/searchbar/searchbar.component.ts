import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VoxelBuildService } from '../../services/voxel-build.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [
    FormsModule, 
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent implements OnInit {

  constructor(
    private voxelBuildService: VoxelBuildService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
  }
  searchbar = new FormControl();
  search() {
    const searchString = this.searchbar.value;
    this.router.navigate(['/posts'], { queryParams: { searchString } })
  }


}
