import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TurmaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Obter turmas visíveis (participa + públicas)
  getTurmas(usuarioId?: number): Observable<any[]> {
    const params = usuarioId ? `?usuarioId=${usuarioId}` : '';
    return this.http.get<any[]>(`${this.apiUrl}/turmas${params}`);
  }

  // Obter turma por ID
  getTurma(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/turmas/${id}`);
  }

  // Criar nova turma
  createTurma(turma: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/turmas`, turma);
  }

  // Atualizar turma
  updateTurma(id: number, turma: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/turmas/${id}`, turma);
  }

  // Deletar turma
  deleteTurma(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/turmas/${id}`);
  }

  // Entrar em uma turma
  participar(turmaId: number, usuarioId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/turmas/${turmaId}/participar`, { usuarioId });
  }
}
