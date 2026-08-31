import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {
  suppliers: any[] = [];
  isLoading: boolean = false;
  showListArea: boolean = true;

  // Form Properties
  supplierForm!: FormGroup;
  isEditMode: boolean = false;
  supplierId: number | null = null;
  isSubmitting: boolean = false;

  constructor(
    private supplierService: SupplierService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSuppliers();
  }

  initForm(): void {
    this.supplierForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(2)]],
      ContactPerson: [''],
      Phone: ['', [Validators.pattern('^[0-9+ -]{7,15}$')]],
      Email: ['', [Validators.email]],
      Address: ['']
    });
  }

  private extractArray(res: any): any[] {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.$values)) return res.$values;
    if (Array.isArray(res.data)) return res.data;
    return [];
  }

  loadSuppliers(): void {
    this.isLoading = true;
    this.supplierService.getSuppliers().subscribe({
      next: (res: any) => {
        this.suppliers = this.extractArray(res);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching suppliers:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error! ❌',
          text: 'Suppliers load nahi ho sake.',
          background: '#0f172a',
          color: '#f8fafc'
        });
      }
    });
  }

  // --- View Toggle Actions ---
  navigateToAdd(): void {
    this.isEditMode = false;
    this.supplierId = null;
    this.supplierForm.reset();
    this.showListArea = false; // Form Open 📝
  }

  navigateToEdit(supplier: any): void {
    this.isEditMode = true;
    this.supplierId = supplier.supplierID ?? supplier.SupplierID ?? supplier.id;

    this.supplierForm.patchValue({
      Name: supplier.name ?? supplier.Name,
      ContactPerson: supplier.contactPerson ?? supplier.ContactPerson,
      Phone: supplier.phone ?? supplier.Phone,
      Email: supplier.email ?? supplier.Email,
      Address: supplier.address ?? supplier.Address
    });

    this.showListArea = false; // Form Open ✏️
  }

  goBackToList(): void {
    this.showListArea = true; // Table Open 📊
  }

  // --- Submit & Delete ---
  onSubmit(): void {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formVal = this.supplierForm.value;

    const payload = {
      Name: formVal.Name,
      ContactPerson: formVal.ContactPerson,
      Phone: formVal.Phone,
      Email: formVal.Email,
      Address: formVal.Address
    };

    if (this.isEditMode && this.supplierId) {
      const updatePayload = {
        SupplierID: Number(this.supplierId),
        ...payload
      };

      this.supplierService.updateSupplier(this.supplierId, updatePayload).subscribe({
        next: () => {
          Swal.fire({
            title: 'Updated! ✏️',
            text: 'Supplier details updated successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#0f172a',
            color: '#f8fafc'
          });
          this.isSubmitting = false;
          this.loadSuppliers();
          this.showListArea = true;
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Error! ❌',
            text: 'Supplier update nahi ho saka.',
            background: '#0f172a',
            color: '#f8fafc'
          });
          this.isSubmitting = false;
        }
      });
    } else {
      this.supplierService.createSupplier(payload).subscribe({
        next: () => {
          Swal.fire({
            title: 'Created! 🎉',
            text: 'New supplier added successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#0f172a',
            color: '#f8fafc'
          });
          this.isSubmitting = false;
          this.loadSuppliers();
          this.showListArea = true;
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Error! ❌',
            text: 'Supplier create nahi ho saka.',
            background: '#0f172a',
            color: '#f8fafc'
          });
          this.isSubmitting = false;
        }
      });
    }
  }

  onDelete(id: number, name: string): void {
    Swal.fire({
      title: 'Are you sure? ⚠️',
      text: `Do you want to delete supplier "${name}"?`,
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
        this.supplierService.deleteSupplier(id).subscribe({
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
            this.loadSuppliers();
          },
          error: (err: any) => {
            console.error(err);
            const errorMsg = err.error?.message || 'Supplier delete nahi ho saka.';
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