import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-dashboard',
 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  summaryData: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getDashboardStats().subscribe({
      next: (res: any) => {
        this.summaryData = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard summary:', err);
        this.errorMessage = 'Dashboard statistics load nahi ho sakain.';
        this.isLoading = false;
      }
    });
  }
}