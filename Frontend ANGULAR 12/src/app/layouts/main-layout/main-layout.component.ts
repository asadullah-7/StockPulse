import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  currentUser: any = null;
  isAdmin: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();

    // 🔒 STRICT CHECK: Sirf Admin Role hone par hamesha TRUE hoga
    this.isAdmin = this.authService.hasRole('Admin');

    // Safe Fallback: Agar token mein role identity missing hai lekin User Object backend ne return kiya ho
    if (!this.isAdmin && this.currentUser) {
      const userRole = this.currentUser.role || this.currentUser.Role;
      if (userRole && userRole.toString().toLowerCase() === 'admin') {
        this.isAdmin = true;
      }
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
}