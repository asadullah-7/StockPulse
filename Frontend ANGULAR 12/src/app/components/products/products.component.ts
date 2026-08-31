import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  brands: any[] = [];
  
  isLoading: boolean = false;
  showListArea: boolean = true;
  
  // Form State
  productForm!: FormGroup;
  isEditMode: boolean = false;
  productId: number | null = null;
  isSubmitting: boolean = false;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
    this.loadDropdowns();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(2)]],
      Price: [null, [Validators.required, Validators.min(0.01)]],
      QtyInStock: [0, [Validators.required, Validators.min(0)]],
      ReOrderThreshold: [5, [Validators.required, Validators.min(0)]],
      CatID: [null, [Validators.required]],
      BrandID: [null, [Validators.required]]
    });
  }

  private extractArray(res: any): any[] {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.$values)) return res.$values;
    if (Array.isArray(res.data)) return res.data;
    return [];
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.products = this.extractArray(res);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error! ❌',
          text: 'Products load nahi ho sake.',
          background: '#0f172a',
          color: '#f8fafc'
        });
      }
    });
  }

  loadDropdowns(): void {
    this.productService.getCategories().subscribe({
      next: (res: any) => (this.categories = this.extractArray(res)),
      error: (err: any) => console.error('Error loading categories:', err)
    });

    this.productService.getBrands().subscribe({
      next: (res: any) => (this.brands = this.extractArray(res)),
      error: (err: any) => console.error('Error loading brands:', err)
    });
  }

  // --- View Switching Methods ---
  navigateToAdd(): void {
    this.isEditMode = false;
    this.productId = null;
    this.productForm.reset({
      QtyInStock: 0,
      ReOrderThreshold: 5
    });
    this.showListArea = false; // Show Form 📝
  }

  navigateToEdit(product: any): void {
    this.isEditMode = true;
    this.productId = product.pid ?? product.PID ?? product.id;

    const matchedCategory = this.categories.find(
      c => (c.catName ?? c.CatName)?.toLowerCase() === (product.categoryName ?? product.CategoryName)?.toLowerCase()
    );
    
    const matchedBrand = this.brands.find(
      b => (b.name ?? b.Name)?.toLowerCase() === (product.brandName ?? product.BrandName)?.toLowerCase()
    );

    this.productForm.patchValue({
      Name: product.name ?? product.Name,
      Price: product.price ?? product.Price,
      QtyInStock: product.qtyInStock ?? product.QtyInStock,
      ReOrderThreshold: product.reOrderThreshold ?? product.ReOrderThreshold ?? 5,
      CatID: matchedCategory ? (matchedCategory.catID ?? matchedCategory.CatID) : (product.catID ?? product.CatID),
      BrandID: matchedBrand ? (matchedBrand.brandID ?? matchedBrand.BrandID) : (product.brandID ?? product.BrandID)
    });

    this.showListArea = false; // Show Form ✏️
  }

  goBackToList(): void {
    this.showListArea = true; // Show Table 📊
  }

  // --- Actions ---
  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formVal = this.productForm.value;

    const payload = {
      Name: formVal.Name,
      Price: Number(formVal.Price),
      QtyInStock: Number(formVal.QtyInStock),
      ReOrderThreshold: Number(formVal.ReOrderThreshold),
      CatID: Number(formVal.CatID),
      BrandID: Number(formVal.BrandID),
      SupplierID: 1
    };

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, payload).subscribe({
        next: () => {
          Swal.fire({
            title: 'Updated! ✏️',
            text: 'Product updated successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#0f172a',
            color: '#f8fafc'
          });
          this.isSubmitting = false;
          this.loadProducts();
          this.showListArea = true;
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Error! ❌',
            text: 'Product update nahi ho saka.',
            background: '#0f172a',
            color: '#f8fafc'
          });
          this.isSubmitting = false;
        }
      });
    } else {
      this.productService.createProduct(payload).subscribe({
        next: () => {
          Swal.fire({
            title: 'Created! 🎉',
            text: 'New product added successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#0f172a',
            color: '#f8fafc'
          });
          this.isSubmitting = false;
          this.loadProducts();
          this.showListArea = true;
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Error! ❌',
            text: 'Product create nahi ho saka.',
            background: '#0f172a',
            color: '#f8fafc'
          });
          this.isSubmitting = false;
        }
      });
    }
  }

  onDeleteProduct(product: any): void {
    const id = product.pid ?? product.PID ?? product.id;
    const name = product.name ?? product.Name ?? 'Product';

    if (!id) {
      Swal.fire({
        title: 'Error! ❌',
        text: 'Product ID is invalid or missing.',
        icon: 'error',
        background: '#0f172a',
        color: '#f8fafc'
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure? ⚠️',
      text: `Do you want to delete "${name}"? You cannot restore it!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it! 🗑️',
      cancelButtonText: 'Cancel',
      background: '#0f172a',
      color: '#f8fafc'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted! 💥',
              text: `"${name}" has been deleted successfully.`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              background: '#0f172a',
              color: '#f8fafc'
            });
            this.loadProducts();
          },
          error: (err: any) => {
            console.error(err);
            const errorMsg = err.error?.message || 'Product delete nahi hua.';
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed! ❌',
              text: errorMsg,
              background: '#0f172a',
              color: '#f8fafc'
            });
          }
        });
      }
    });
  }
} 