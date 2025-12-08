import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {

  @Input() event: any = null;         // recebe o evento
  @Input() visible: boolean = false;  // controla exibição
  @Input() editVisible: boolean = false;
  @Output() close = new EventEmitter<void>(); // emite fechamento
  @Output() edit = new EventEmitter<any>();

  constructor() {}

  newEvent = {
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  };

  ngOnInit(): void {}

  closeModal() {
    this.close.emit();
  }
  openEdit() {
  this.editVisible = true;    // mostra modal de edição
  this.newEvent = {
    title: this.event.title,
    startDate: this.event.start ? this.event.start.toISOString().substring(0,10) : '',
    endDate: this.event.end ? this.event.end.toISOString().substring(0,10) : '',
    startTime: this.event.start ? this.event.start.toTimeString().substring(0,5) : '',
    endTime: this.event.end ? this.event.end.toTimeString().substring(0,5) : ''
  };
}
cancelEdit() {
  this.editVisible = false;   // fecha modal de edição
  this.close.emit();
}


  compareDates(d1: any, d2: any): boolean {
    if (!d1 || !d2) return false;
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
