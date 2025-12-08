import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'epis';
  calendarOptions: any = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    events: [
      { title: 'Evento 1', date: '2025-12-05' }
    ]
  };
  AccessibilityButtonComponent:any;
}
