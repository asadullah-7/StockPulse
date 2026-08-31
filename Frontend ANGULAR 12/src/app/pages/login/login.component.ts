import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../models/login';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginModel: Login = {
    userName: '',
    password: ''
  };

  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    if (!this.loginModel.userName || !this.loginModel.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error ⚠️',
        text: 'Please enter both username and password.',
        confirmButtonColor: '#19b45f'
      });
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginModel).subscribe({
      next: (res) => {
        this.isLoading = false;
        
        // Save auth data
        this.authService.saveToken(res.token);
        this.authService.saveUser(res.user);

        // Success Alert 🌟
        Swal.fire({
          icon: 'success',
          title: 'Welcome Back! 👋',
          text: 'Login successful. Redirecting to dashboard...',
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        this.isLoading = false;

        // Error Alert ❌
        Swal.fire({
          icon: 'error',
          title: 'Access Denied 🚫',
          text: err.error?.message || 'Invalid username or password!',
          confirmButtonColor: '#dc3545',
          confirmButtonText: 'Try Again'
        });
      }
    });
  }
}