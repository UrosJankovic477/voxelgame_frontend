import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentWriteComponent } from './comment-write.component';

describe('CommentWriteComponent', () => {
  let component: CommentWriteComponent;
  let fixture: ComponentFixture<CommentWriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentWriteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommentWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
