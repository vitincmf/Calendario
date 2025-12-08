import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-layout-principal',
  templateUrl: './layout-principal.component.html',
  styleUrls: ['./layout-principal.component.css']
})
export class LayoutPrincipalComponent implements OnInit {

  public highContrast: boolean = false;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
  }

  toggleContrast(state: boolean) {
    this.highContrast = state;
    if (state) {
       document.body.classList.add('high-contrast');
      this.renderer.addClass(this.el.nativeElement, 'high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
      this.renderer.removeClass(this.el.nativeElement, 'high-contrast');
    }
    localStorage.setItem('highContrast', String(state));
  }

}
