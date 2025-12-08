import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutPrincipalComponent } from './layout-principal.component';

describe('LayoutPrincipalComponent', () => {
  let component: LayoutPrincipalComponent;
  let fixture: ComponentFixture<LayoutPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutPrincipalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
