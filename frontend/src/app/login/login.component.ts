import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginError: string = '';
  isLoading: boolean = false;

  public loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required])
  });

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  entrar() {
    if (!this.loginForm.valid) {
      this.loginError = 'Preencha todos os campos corretamente';
      return;
    }

    this.isLoading = true;
    this.loginError = '';

    const email = this.loginForm.get('email')?.value || '';
    const password = this.loginForm.get('password')?.value || '';

    this.authService.login(email, password).subscribe(
      (usuario: any) => {
        this.isLoading = false;
        this.authService.setUsuarioLogado(usuario);
        console.log('Login bem-sucedido:', usuario);
        // Pequeno delay para garantir que o estado foi atualizado
        setTimeout(() => {
          this.router.navigateByUrl("/main");
        }, 100);
      },
      (error: any) => {
        this.isLoading = false;
        const errorMessage = error.error?.error || error.message || 'Erro ao fazer login';
        this.loginError = errorMessage;
        console.error('Erro ao fazer login:', error);
      }
    );
  }

  esqueciSenha() {
    alert('Por favor, entre em contato com o administrador para resetar sua senha');
  }

  registrarConta() {
    console.log('Navegando para registro...');
    this.router.navigate(['/auth/register']);
  }
}
