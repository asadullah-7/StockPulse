import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  categoryForm!: FormGroup;
  isEditMode: boolean = false;
  selectedCatId: number | null = null;
  isSubmitting: boolean = false;
  isLoading: boolean = false;

  constructor(private productService: ProductService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      CatName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  loadCategories(): void {
    this.isLoading = true;
    this.productService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to load categories!',
          background: '#0f172a',
          color: '#f8fafc'
        });
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedCatId = null;
    this.categoryForm.reset();
  }

  openEditModal(cat: any): void {
    this.isEditMode = true;
    this.selectedCatId = cat.catID ?? cat.CatID;
    this.categoryForm.patchValue({
      CatName: cat.catName ?? cat.CatName
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;
    this.isSubmitting = true;

    if (this.isEditMode && this.selectedCatId) {
      const payload = {
        CatID: Number(this.selectedCatId),
        CatName: this.categoryForm.value.CatName
      };
      this.productService.updateCategory(this.selectedCatId, payload).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Updated! ✏️',
            text: 'Category updated successfully.',
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
            text: 'Failed to update category.',
            background: '#0f172a',
            color: '#f8fafc'
          });
        }
      });
    } else {
      const payload = { CatName: this.categoryForm.value.CatName };
      this.productService.createCategory(payload).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Added! 🎉',
            text: 'New category created successfully.',
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
            text: 'Failed to create category.',
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
      text: `Do you want to delete category "${name}"?`,
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
        this.productService.deleteCategory(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Category has been deleted.',
              timer: 1500,
              showConfirmButton: false,
              background: '#0f172a',
              color: '#f8fafc'
            });
            this.loadCategories();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Could not delete category.',
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
    const modalElement = document.getElementById('categoryModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
    this.loadCategories();
  }
}