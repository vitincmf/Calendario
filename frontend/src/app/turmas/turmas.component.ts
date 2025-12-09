import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TurmaService } from '../services/turma.service';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../services/auth.service';
import { EventoService } from '../services/evento.service';

@Component({
  selector: 'app-turmas',
  templateUrl: './turmas.component.html',
  styleUrls: ['./turmas.component.css']
})
export class TurmasComponent implements OnInit {
  usuarioLogado: any = null;
  usuarios: any[] = [];
  turmas: any[] = [];
  minhasTurmas: any[] = [];
  turmasPublicas: any[] = [];
  criando = false;
  criandoEvento = false;

  novaTurma = {
    nome: '',
    descricao: '',
    tipo: '',
    publico: false,
    administradorId: null as number | null
  };

  novoEventoTurma = {
    turmaId: null as number | null,
    titulo: '',
    data: '',
    horaInicio: '',
    horaFim: '',
    publico: false
  };

  selecionados = new Set<number>();

  constructor(
    private turmaService: TurmaService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private eventoService: EventoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioLogado = this.authService.getUsuarioLogado();
    if (!this.usuarioLogado) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.novaTurma.administradorId = this.usuarioLogado.id;
    this.selecionados.add(this.usuarioLogado.id);
    this.carregarUsuarios();
    this.carregarTurmas();
  }

  carregarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => (this.usuarios = usuarios || []),
      error: (error) => console.error('Erro ao carregar usuários', error)
    });
  }

  carregarTurmas() {
    this.turmaService.getTurmas(this.usuarioLogado.id).subscribe({
      next: (turmas) => {
        this.turmas = turmas || [];
        const participaSet = new Set(
          (turmas || [])
            .filter((t: any) => t.participa)
            .map((t: any) => t.id)
        );
        this.minhasTurmas = (turmas || []).filter((t: any) => t.participa);
        this.turmasPublicas = (turmas || []).filter(
          (t: any) => t.publico && !participaSet.has(t.id)
        );

        if (!this.novoEventoTurma.turmaId && this.minhasTurmas.length > 0) {
          this.novoEventoTurma.turmaId = this.minhasTurmas[0].id;
        }
      },
      error: (error) => console.error('Erro ao carregar turmas', error)
    });
  }

  toggleUsuario(id: number) {
    if (this.selecionados.has(id)) {
      this.selecionados.delete(id);
    } else {
      this.selecionados.add(id);
    }
  }

  criarTurma() {
    if (!this.novaTurma.nome.trim()) {
      alert('Informe um nome para a turma');
      return;
    }

    const adminId = this.novaTurma.administradorId || this.usuarioLogado.id;
    this.selecionados.add(adminId);
    this.selecionados.add(this.usuarioLogado.id);

    const usuarioIdsArray = Array.from(this.selecionados).map(id => parseInt(String(id), 10));

    const payload = {
      nome: this.novaTurma.nome,
      descricao: this.novaTurma.descricao,
      tipo: this.novaTurma.tipo,
      publico: this.novaTurma.publico,
      administradorId: parseInt(String(adminId), 10),
      criadorId: parseInt(String(this.usuarioLogado.id), 10),
      usuarioIds: usuarioIdsArray
    };

    console.log('Enviando payload:', payload);

    this.criando = true;
    this.turmaService.createTurma(payload).subscribe({
      next: (turma) => {
        console.log('Turma criada:', turma);
        this.criando = false;
        this.resetForm();
        this.carregarTurmas();
      },
      error: (error) => {
        this.criando = false;
        console.error('Erro ao criar turma', error);
        alert('Não foi possível criar a turma');
      }
    });
  }

  participar(turmaId: number) {
    this.turmaService.participar(turmaId, this.usuarioLogado.id).subscribe({
      next: () => this.carregarTurmas(),
      error: (error) => {
        console.error('Erro ao participar da turma', error);
        alert('Não foi possível entrar na turma');
      }
    });
  }

  criarEventoTurma() {
    if (!this.novoEventoTurma.turmaId) {
      alert('Selecione uma turma');
      return;
    }
    const turmaSelecionada = this.minhasTurmas.find(t => t.id === this.novoEventoTurma.turmaId);
    if (!turmaSelecionada || turmaSelecionada.administrador?.id !== this.usuarioLogado.id) {
      alert('Apenas o administrador da turma pode criar eventos');
      return;
    }
    if (!this.novoEventoTurma.titulo || !this.novoEventoTurma.data || !this.novoEventoTurma.horaInicio) {
      alert('Preencha título, data e hora de início');
      return;
    }

    // monta datas locais para evitar volta de dia por fuso
    const [y, m, d] = this.novoEventoTurma.data.split('-').map(Number);
    const [hi, mi] = this.novoEventoTurma.horaInicio.split(':').map(Number);
    const inicioDate = new Date(y, m - 1, d, hi, mi, 0);
    const inicio = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(hi).padStart(2, '0')}:${String(mi).padStart(2, '0')}:00`;

    let fim: string | undefined;
    if (this.novoEventoTurma.horaFim) {
      const [hf, mf] = this.novoEventoTurma.horaFim.split(':').map(Number);
      const fimDate = new Date(y, m - 1, d, hf, mf, 0);
      fim = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(hf).padStart(2, '0')}:${String(mf).padStart(2, '0')}:00`;
      // evita fim antes de inicio
      if (fimDate < inicioDate) {
        alert('Hora de fim não pode ser antes do início');
        return;
      }
    }

    const payload = {
      titulo: this.novoEventoTurma.titulo,
      dataInicio: inicio,
      dataFim: fim,
      publico: this.novoEventoTurma.publico,
      turmaId: this.novoEventoTurma.turmaId,
      criadorId: this.usuarioLogado.id
    };

    this.criandoEvento = true;
    this.turmaService.participar(this.novoEventoTurma.turmaId, this.usuarioLogado.id).subscribe({
      next: () => {
        this.eventoService.createEventoTurma(payload).subscribe({
          next: () => {
            this.criandoEvento = false;
            alert('Evento da turma criado');
            this.resetEventoTurma();
          },
          error: (error: any) => {
            this.criandoEvento = false;
            console.error('Erro ao criar evento da turma', error);
            alert('Não foi possível criar o evento da turma');
          }
        });
      },
      error: () => {
        // Se já participa, o endpoint pode falhar por duplicidade; tenta ainda criar evento
        this.eventoService.createEventoTurma(payload).subscribe({
          next: () => {
            this.criandoEvento = false;
            alert('Evento da turma criado');
            this.resetEventoTurma();
          },
          error: (error: any) => {
            this.criandoEvento = false;
            console.error('Erro ao criar evento da turma', error);
            alert('Não foi possível criar o evento da turma');
          }
        });
      }
    });
  }

  ehSelecionado(id: number): boolean {
    return this.selecionados.has(id);
  }

  private resetForm() {
    this.novaTurma = {
      nome: '',
      descricao: '',
      tipo: '',
      publico: false,
      administradorId: this.usuarioLogado.id
    };
    this.selecionados = new Set<number>([this.usuarioLogado.id]);
  }

  private resetEventoTurma() {
    this.novoEventoTurma = {
      turmaId: this.minhasTurmas.length > 0 ? this.minhasTurmas[0].id : null,
      titulo: '',
      data: '',
      horaInicio: '',
      horaFim: '',
      publico: false
    };
  }
}
