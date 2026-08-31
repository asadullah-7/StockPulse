import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  isLoading: boolean = false;
  showListArea: boolean = true;

  // Form Properties
  customerForm!: FormGroup;
  isEditMode: boolean = false;
  customerId: number | null = null;
  isSubmitting: boolean = false;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCustomers();
  }

  initForm(): void {
    this.customerForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(2)]],
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

  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe({
      next: (res: any) => {
        this.customers = this.extractArray(res);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching customers:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error! ❌',
          text: 'Customers load nahi ho sake.',
          background: '#0f172a',
          color: '#f8fafc'
        });
      }
    });
  }

  // --- View Toggle Actions ---
  navigateToAdd(): void {
    this.isEditMode = false;
    this.customerId = null;
    this.customerForm.reset();
    this.showListArea = false; // Form View Open 📝
  }

  navigateToEdit(customer: any): void {
    this.isEditMode = true;
    this.customerId = customer.customerID ?? customer.CustomerID ?? customer.id;

    this.customerForm.patchValue({
      Name: customer.name ?? customer.Name,
      Phone: customer.phone ?? customer.Phone,
      Email: customer.email ?? customer.Email,
      Address: customer.address ?? customer.Address
    });

    this.showListArea = false; // Form View Open ✏️
  }

  goBackToList(): void {
    this.showListArea = true; // Table View Open 📊
  }

  // --- Submit & Delete ---
  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formVal = this.customerForm.value;

    const payload = {
      Name: formVal.Name,
      Phone: formVal.Phone,
      Email: formVal.Email,
      Address: formVal.Address
    };

    if (this.isEditMode && this.customerId) {
      const updatePayload = {
        CustomerID: Number(this.customerId),
        ...payload
      };

      this.customerService.updateCustomer(this.customerId, updatePayload).subscribe({
        next: () => {
          Swal.fire({
            title: 'Updated! ✏️',
            text: 'Customer details updated successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#0f172a',
            color: '#f8fafc'
          });
          this.isSubmitting = false;
          this.loadCustomers();
          this.showListArea = true;
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Error! ❌',
            text: 'Customer update nahi ho saka.',
            background: '#0f172a',
            color: '#f8fafc'
          });
          this.isSubmitting = false;
        }
      });
    } else {
      this.customerService.createCustomer(payload).subscribe({
        next: () => {
          Swal.fire({
            title: 'Created! 🎉',
            text: 'New customer added successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#0f172a',
            color: '#f8fafc'
          });
          this.isSubmitting = false;
          this.loadCustomers();
          this.showListArea = true;
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Error! ❌',
            text: 'Customer add nahi ho saka.',
            background: '#0f172a',
            color: '#f8fafc'
          });
          this.isSubmitting = false;
        }
      });
    }
  }

  onDelete(customer: any): void {
    const id = customer?.customerID ?? 
               customer?.CustomerID ?? 
               customer?.id ?? 
               customer?.ID ?? 
               customer?.custID ?? 
               customer?.CustID;

    const name = customer?.name ?? customer?.Name ?? 'Customer';

    console.log('Customer Object:', customer);
    console.log('Extracted ID:', id);

    if (!id) {
      Swal.fire({
        title: 'Error! ❌',
        text: 'Customer ID is invalid or missing.',
        icon: 'error',
        background: '#0f172a',
        color: '#f8fafc'
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure? ⚠️',
      text: `Do you really want to delete "${name}"?`,
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
        this.customerService.deleteCustomer(Number(id)).subscribe({
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
            this.loadCustomers();
          },
          error: (err: any) => {
            console.error('Delete Error Detail:', err);
            const errorMsg = err.error?.message || 'Cannot delete customer because they have linked transaction records.';
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