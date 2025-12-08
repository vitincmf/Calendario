import { Component, Renderer2, ElementRef, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { CalendarOptions, DatesSetArg, DayHeaderContentArg } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { HttpClient } from '@angular/common/http';
import { EventoService } from '../services/evento.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface AppEvent extends EventInput {
  // title?: string; start?: string | Date; end?: string | Date; color?: string; etc.
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;

  showModal = false;
  showViewModal = false;
  editVisible = false;
  selectedEvent: any = null;
  usuarioLogado: any = null;

  // dados do novo evento
  newEvent: {
    title: string;
    startDate: string;
    startTime: string;
    endDate?: string;
    endTime?: string;
  } = {
      title: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    };

  compareDates(d1: Date | string | null, d2: Date | string | null): boolean {
    if (!d1 || !d2) return false;

    const date1 = new Date(d1);
    const date2 = new Date(d2);

    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  highContrast = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private http: HttpClient,
    private eventoService: EventoService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Verifica se usuário está logado usando o observable
    this.authService.usuarioLogado$.subscribe((usuario: any) => {
      this.usuarioLogado = usuario;
      
      if (!this.usuarioLogado) {
        alert('Você precisa fazer login para acessar o calendário');
        this.router.navigate(['/login']);
        return;
      }

      // Lê o estado salvo no navegador
      const savedContrast = localStorage.getItem('highContrast');
      if (savedContrast === 'true') {
        this.highContrast = true;
        this.renderer.addClass(document.body, 'high-contrast');
        this.renderer.addClass(this.el.nativeElement, 'high-contrast');
      }

      // Carrega eventos do banco de dados
      this.loadEventosFromDatabase();
    });
  }

  ngOnChanges(){
    
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
  eventsArray: EventInput[] = [
    { title: 'Aula de APS', start: '2025-11-27T08:00:00', end: '2025-11-27T12:00:00' },
    { title: 'Evento rápido', start: '2025-12-05T09:30:00' }, // sem end = duração padrão (depende)
    { title: 'Dia inteiro', start: '2025-12-10', allDay: true }, // all-day
    { title: 'Aula de matematica', start: '2025-12-03T08:00:00', end: '2025-12-03T09:00:00' }
  ];


  // Tipando como 'any' para evitar erro
  calendarOptions: any = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    buttonText: {       // redefine os textos dos botões
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Dia',
      prev: 'Anterior',
      next: 'Próximo'
    },
    locale: ptBrLocale,
    allDaySlot: false,
    // intervalo de horários exibidos
    slotMinTime: '00:00:00',
    slotMaxTime: '24:00:00',
    // tamanho dos blocos de hora
    slotDuration: '01:00:00',
    // 👉 FORMATO DA HORA PERSONALIZADO
    slotLabelContent: (arg: any) => {
      const hora = arg.date.getHours();
      const minutos = arg.date.getMinutes().toString().padStart(2, '0');
      return `${hora}h:${minutos}`;
    },

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    views: {
      dayGridMonth: {
        firstDay: 0 // domingo
      },
      timeGridWeek: {
        firstDay: 1 // segunda-feira
      },
      timeGridDay: {
        firstDay: 1 // segunda-feira
      }
    },
    dayHeaderContent: (args: DayHeaderContentArg) => {
      const diasMes = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
      const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const diaSemana = dias[args.date.getDay()];
      const diaMes = diasMes[args.date.getDay()];
      const numeroDia = args.date.getDate();

      // args.view.type -> identifica a view atual: 'dayGridMonth', 'timeGridWeek', 'timeGridDay', etc
      if (args.view.type === 'dayGridMonth') {
        // modo mensal: apenas abreviado do dia
        return diaMes;
      } else {
        // modo semanal ou diário: dia + número
        return {
          html: `
        <div style="text-align:center; margin:0; line-height:1;">
          <span style="display:block; font-size:1rem; margin:0;">${diaSemana}</span>
          <span style="display:block; font-size:2rem; font-weight:bold; margin:0;">${numeroDia}</span>
        </div>
      `};
      }
    },
    titleFormat: {
      year: 'numeric',
      month: 'long'
    },
    datesSet: (arg: DatesSetArg) => {
      const header = document.querySelector('.fc-toolbar-title');
      if (header) {
        const monthNames = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        const date = arg.view.currentStart; // agora pega corretamente o mês da view
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        header.textContent = `${month} de ${year}`; // sobrescreve corretamente
      }
    }, eventClick: (arg: any) => {
      this.selectedEvent = {
        title: arg.event.title,
        start: arg.event.start,
        end: arg.event.end
      };
      this.showViewModal = true; // agora ele abre o EventViewComponent
    }



  };

  addEvent() {
    const api = this.fullcalendar.getApi();
    api.addEvent({ title: 'Novo', start: new Date(), end: new Date(Date.now() + 3600_000) });
    // ou também: this.eventsArray.push({...}); Angular atualizará o calendário automaticamente
  }
  openModal() {
    if (!this.usuarioLogado) {
      alert('Você precisa fazer login para criar eventos');
      this.router.navigate(['/login']);
      return;
    }

    this.showModal = true;
    this.newEvent = {
      title: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    };
  }
  openEditModal(event: any) {
    this.showViewModal = false;   // fecha modal de visualização
    this.editVisible = true;      // abre modal de edição

    // Preenche os campos do formulário com os dados do evento
    this.newEvent = {
      title: event.title,
      startDate: event.start ? event.start.toISOString().substring(0, 10) : '',
      endDate: event.end ? event.end.toISOString().substring(0, 10) : '',
      startTime: event.start ? event.start.toTimeString().substring(0, 5) : '',
      endTime: event.end ? event.end.toTimeString().substring(0, 5) : ''
    };
  }

  closeModal() {
    this.showModal = false;
  }

  // Carrega eventos do banco de dados
  loadEventosFromDatabase() {
    this.eventoService.getEventos().subscribe(
      (eventos: any[]) => {
        this.eventsArray = eventos.map(e => ({
          title: e.titulo,
          start: e.dataInicio,
          end: e.dataFim || undefined
        }));
      },
      (error) => {
        console.error('Erro ao carregar eventos:', error);
      }
    );
  }

  saveEvent() {
    if (!this.newEvent.title || !this.newEvent.startDate || !this.newEvent.startTime) {
      alert('Preencha ao menos título, data e hora de início.');
      return;
    }

    if (!this.usuarioLogado) {
      alert('Erro: usuário não autenticado');
      return;
    }

    // Parser seguro para data (evita interpretar como UTC e "voltar" um dia)
    const parseLocalDate = (dateStr: string) => {
      const [yyyy, mm, dd] = dateStr.split('-').map(Number);
      // new Date(ano, mesIndex, dia) cria a data na timezone local sem deslocamento UTC
      return new Date(yyyy, mm - 1, dd);
    };

    // Se não houver data final, assume apenas o dia de início
    const startDate = parseLocalDate(this.newEvent.startDate);
    const endDate = this.newEvent.endDate ? parseLocalDate(this.newEvent.endDate) : startDate;

    // Loop de cada dia
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      // Formata o dia atual
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');

      // Combina com as horas fornecidas (formato local, sem "Z")
      const start = `${yyyy}-${mm}-${dd}T${this.newEvent.startTime}`;
      const end = this.newEvent.endTime ? `${yyyy}-${mm}-${dd}T${this.newEvent.endTime}` : undefined;

      const eventoData = {
        titulo: this.newEvent.title,
        dataInicio: start,
        dataFim: end,
        descricao: '',
        publico: false,
        turmaId: 1  // Você pode ajustar isso conforme necessário
      };

      // Salva no banco de dados
      this.eventoService.createEvento(eventoData).subscribe(
        (eventoSalvo: any) => {
          // Associa evento ao usuário logado
          const eventoUsuarioData = {
            usuarioId: this.usuarioLogado.id,
            eventoId: eventoSalvo.id,
            cargo: 'Participante'
          };

          // Salva a associação evento_usuario
          this.http.post(`${environment.apiUrl}/eventos_usuarios`, eventoUsuarioData).subscribe(
            () => {
              console.log('Evento associado ao usuário com sucesso');
            },
            (error: any) => {
              console.error('Erro ao associar evento ao usuário:', error);
            }
          );

          // Adiciona no calendário quando completa
          const api = this.fullcalendar.getApi();
          api.addEvent({
            id: eventoSalvo.id,
            title: eventoSalvo.titulo,
            start: eventoSalvo.dataInicio,
            end: eventoSalvo.dataFim
          });
        },
        (error) => {
          console.error('Erro ao salvar evento:', error);
          alert('Erro ao salvar evento no banco de dados');
        }
      );
    }

    this.closeModal();
  }
}

