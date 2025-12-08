import { Component,EventEmitter, Output, OnInit  } from '@angular/core';

@Component({
  selector: 'app-accessibility-button',
  templateUrl: './accessibility-button.component.html',
  styleUrls: ['./accessibility-button.component.css']
})
export class AccessibilityButtonComponent implements OnInit {

    isOpen = false;
    isContrastOn = false; // estado do switch

   @Output() contrastToggle = new EventEmitter<boolean>();

   ngOnInit(): void {
    // Carrega o estado salvo no navegador
    const saved = localStorage.getItem('highContrast');
    this.isContrastOn = saved === 'true';
  }

  toggleBox() {
    this.isOpen = !this.isOpen;
  }

     onToggleContrast(event: any) {
    this.isContrastOn = event.target.checked;

    // Salva no navegador
    localStorage.setItem('highContrast', String(this.isContrastOn));

    // Notifica o pai enviando o estado atualizado
    this.contrastToggle.emit(this.isContrastOn);
  }

}
