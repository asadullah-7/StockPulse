import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  private apiUrl = 'https://localhost:7004/api/Auth';

  users: any[] = [];
  userForm!: FormGroup;
  
  showListArea: boolean = true;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  selectedUserId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.fetchUsers();
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  initForm(): void {
    this.userForm = this.fb.group({
      UserName: ['', [Validators.required, Validators.minLength(3)]],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(4)]],
      Role: ['User', [Validators.required]]
    });
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.http.get<any[]>(`${this.apiUrl}/users`, this.getAuthHeaders()).subscribe({
      next: (res) => {
        this.users = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Fetch Users Error:', err);
        this.isLoading = false;
      }
    });
  }

  // Alias methods taake purana aur naya HTML dono support ho sakein
  openCreateModal(): void {
    this.navigateToAdd();
  }

  navigateToAdd(): void {
    this.isEditMode = false;
    this.selectedUserId = null;
    this.userForm.reset({ Role: 'User' });

    const passControl = this.userForm.get('Password');
    passControl?.setValidators([Validators.required, Validators.minLength(4)]);
    passControl?.updateValueAndValidity();

    this.showListArea = false;
  }

  openEditModal(user: any): void {
    this.navigateToEdit(user);
  }

  navigateToEdit(user: any): void {
    this.isEditMode = true;
    this.selectedUserId = user.id || user.Id;

    const passControl = this.userForm.get('Password');
    passControl?.clearValidators();
    passControl?.updateValueAndValidity();

    this.userForm.patchValue({
      UserName: user.userName || user.UserName,
      Email: user.email || user.Email,
      Password: '',
      Role: user.role || user.Role || 'User'
    });

    this.showListArea = false;
  }

  goBackToList(): void {
    this.showListArea = true;
  }

  saveUser(): void {
    this.onSubmit();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.userForm.value;

    if (this.isEditMode && this.selectedUserId) {
      // UPDATE USER
      const updatePayload = {
        UserName: formData.UserName,
        Email: formData.Email,
        Password: formData.Password || null,
        Role: formData.Role
      };

      this.http.put(`${this.apiUrl}/users/${this.selectedUserId}`, updatePayload, this.getAuthHeaders()).subscribe({
        next: () => {
          this.isSubmitting = false;
          Swal.fire({
            icon: 'success',
            title: 'User Updated! 🎉',
            timer: 1500,
            showConfirmButton: false
          });
          this.fetchUsers();
          this.goBackToList();
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Update Error Detail:', err.error);
          const errorMsg = err.error?.message || (typeof err.error === 'string' ? err.error : 'Update failed.');
          Swal.fire('Error ❌', errorMsg, 'error');
        }
      });
    } else {
      // REGISTER USER
      const registerPayload = {
        UserName: formData.UserName,
        Email: formData.Email,
        Password: formData.Password,
        Role: formData.Role
      };

      this.http.post(`${this.apiUrl}/register`, registerPayload, this.getAuthHeaders()).subscribe({
        next: () => {
          this.isSubmitting = false;
          Swal.fire({
            icon: 'success',
            title: 'User Registered! 🚀',
            timer: 1500,
            showConfirmButton: false
          });
          this.fetchUsers();
          this.goBackToList();
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Register Error Detail:', err.error);
          const errorMsg = err.error?.message || (typeof err.error === 'string' ? err.error : 'Registration failed.');
          Swal.fire('Error ❌', errorMsg, 'error');
        }
      });
    }
  }

  deleteUser(userId: string, username: string): void {
    this.onDelete(userId, username);
  }

  onDelete(userId: string, username: string): void {
    Swal.fire({
      title: `Delete '${username}'? ⚠️`,
      text: "Is action ko wapas nahi liya ja sakay ga!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/users/${userId}`, this.getAuthHeaders()).subscribe({
          next: () => {
            Swal.fire('Deleted! 🗑️', 'User record remove kar diya gaya hai.', 'success');
            this.fetchUsers();
          },
          error: (err) => {
            console.error('Delete Error Detail:', err.error);
            const errorMsg = err.error?.message || 'Delete operation fail ho gaya.';
            Swal.fire('Error ❌', errorMsg, 'error');
          }
        });
      }
    });
  }
}