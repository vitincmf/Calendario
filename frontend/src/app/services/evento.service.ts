import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Obter todos os eventos
  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/eventos`);
  }

  // Obter eventos de um usuário específico
  getEventosPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/eventos?usuarioId=${usuarioId}`);
  }

  // Obter evento por ID
  getEvento(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/eventos/${id}`);
  }

  // Criar novo evento
  createEvento(evento: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/eventos`, evento);
  }

  // Criar evento institucional de turma
  createEventoTurma(evento: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/eventos/turma`, evento);
  }

  // Atualizar evento
  updateEvento(id: number, evento: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/eventos/${id}`, evento);
  }

  // Deletar evento
  deleteEvento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eventos/${id}`);
  }
}
