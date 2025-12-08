import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private usuarioLogadoSubject = new BehaviorSubject<any>(null);
  public usuarioLogado$ = this.usuarioLogadoSubject.asObservable();

  constructor(private http: HttpClient) {
    // Carrega usuário do localStorage ao iniciar
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
      this.usuarioLogadoSubject.next(JSON.parse(usuarioSalvo));
    }
  }

  // Registrar novo usuário
  register(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, usuario);
  }

  // Login
  login(email: string, senha: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, senha });
  }

  // Definir usuário logado
  setUsuarioLogado(usuario: any) {
    this.usuarioLogadoSubject.next(usuario);
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
  }

  // Obter usuário logado
  getUsuarioLogado(): any {
    return this.usuarioLogadoSubject.value;
  }

  // Logout
  logout() {
    this.usuarioLogadoSubject.next(null);
    localStorage.removeItem('usuarioLogado');
  }

  // Verificar se está logado
  estaLogado(): boolean {
    return this.usuarioLogadoSubject.value !== null;
  }
}
