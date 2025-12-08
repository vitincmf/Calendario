import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerError: string = '';
  registerSuccess: string = '';
  isLoading: boolean = false;

  public registerForm = new FormGroup({
    nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
    email: new FormControl("", [Validators.required, Validators.email]),
    senha: new FormControl("", [Validators.required, Validators.minLength(6)]),
    confirmSenha: new FormControl("", [Validators.required]),
    cargo: new FormControl("Aluno", [Validators.required])
  });

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  registrar() {
    // Limpa erros anteriores
    this.registerError = '';
    this.registerSuccess = '';

    if (!this.registerForm.valid) {
      this.registerError = 'Preencha todos os campos corretamente';
      return;
    }

    const senha = this.registerForm.get('senha')?.value;
    const confirmSenha = this.registerForm.get('confirmSenha')?.value;

    if (senha !== confirmSenha) {
      this.registerError = 'As senhas não coincidem';
      return;
    }

    this.isLoading = true;

    const novoUsuario = {
      nome: this.registerForm.get('nome')?.value,
      email: this.registerForm.get('email')?.value,
      senha: this.registerForm.get('senha')?.value,
      cargo: this.registerForm.get('cargo')?.value || 'Aluno'
    };

    console.log('Enviando registro:', novoUsuario);

    this.authService.register(novoUsuario).subscribe(
      (usuario: any) => {
        this.isLoading = false;
        console.log('Registro bem-sucedido:', usuario);
        this.registerSuccess = 'Usuário criado com sucesso! Redirecionando...';
        
        // Auto-login após registrar
        setTimeout(() => {
          this.authService.setUsuarioLogado(usuario);
          console.log('Redirecionando para calendário...');
          this.router.navigateByUrl("/main");
        }, 1500);
      },
      (error: any) => {
        this.isLoading = false;
        const errorMsg = error.error?.error || error.message || 'Erro ao criar usuário';
        this.registerError = errorMsg;
        console.error('Erro ao registrar:', error);
      }
    );
  }

  voltar() {
    this.router.navigate(['/auth/login']);
  }
}
