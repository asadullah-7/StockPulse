import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {
  brands: any[] = [];
  brandForm!: FormGroup;
  isEditMode: boolean = false;
  selectedBrandId: number | null = null;
  isSubmitting: boolean = false;
  isLoading: boolean = false;

  constructor(private productService: ProductService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadBrands();
  }

  initForm(): void {
    this.brandForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  loadBrands(): void {
    this.isLoading = true;
    this.productService.getBrands().subscribe({
      next: (res) => {
        this.brands = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to load brands!',
          background: '#0f172a',
          color: '#f8fafc'
        });
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedBrandId = null;
    this.brandForm.reset();
  }

  openEditModal(brand: any): void {
    this.isEditMode = true;
    this.selectedBrandId = brand.brandID ?? brand.BrandID;
    this.brandForm.patchValue({
      Name: brand.name ?? brand.Name
    });
  }

  onSubmit(): void {
    if (this.brandForm.invalid) return;
    this.isSubmitting = true;

    if (this.isEditMode && this.selectedBrandId) {
      const payload = {
        BrandID: Number(this.selectedBrandId),
        Name: this.brandForm.value.Name
      };
      this.productService.updateBrand(this.selectedBrandId, payload).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Updated! ✏️',
            text: 'Brand details updated successfully.',
            timer: 2000,
            showConfirmButton: false,
            background: '#0f172a',
            color: '#f8fafc'
          });
          this.handleSuccess();
        },
        error: () => {
          this.isSubmitting = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update brand.',
            background: '#0f172a',
            color: '#f8fafc'
          });
        }
      });
    } else {
      const payload = { Name: this.brandForm.value.Name };
      this.productService.createBrand(payload).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Added! 🎉',
            text: 'New brand added successfully.',
            timer: 2000,
            showConfirmButton: false,
            background: '#0f172a',
            color: '#f8fafc'
          });
          this.handleSuccess();
        },
        error: () => {
          this.isSubmitting = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to create brand.',
            background: '#0f172a',
            color: '#f8fafc'
          });
        }
      });
    }
  }

  onDelete(id: number, name: string): void {
    Swal.fire({
      title: 'Are you sure? 🗑️',
      text: `Do you want to delete "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#0f172a',
      color: '#f8fafc'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteBrand(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Brand has been deleted.',
              timer: 1500,
              showConfirmButton: false,
              background: '#0f172a',
              color: '#f8fafc'
            });
            this.loadBrands();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Could not delete brand.',
              background: '#0f172a',
              color: '#f8fafc'
            });
          }
        });
      }
    });
  }

  private handleSuccess(): void {
    this.isSubmitting = false;
    const modalElement = document.getElementById('brandModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
    this.loadBrands();
  }
}