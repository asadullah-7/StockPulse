import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

export interface CartItem {
  pid: number;
  productName: string;
  price: number;
  quantity: number;
  subTotal: number;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  products: any[] = [];
  customers: any[] = [];
  recentOrders: any[] = [];
  cart: CartItem[] = [];

  selectedCustomerId: number | null = null;
  selectedProduct: any | null = null;
  inputQuantity: number = 1;

  grandTotal: number = 0;
  isSubmitting: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchAllData();
  }

  fetchAllData(): void {
    this.productService.getCustomers().subscribe({
      next: (res: any) => {
        this.customers = Array.isArray(res) ? res : [];
        this.fetchOrders();
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error! ❌',
          text: 'Customers load nahi ho sake.',
          background: '#0f172a',
          color: '#f8fafc'
        });
      }
    });

    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.products = Array.isArray(res) ? res : [];
      },
      error: (err) => {
        console.error('Error fetching products:', err);
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

  fetchOrders(): void {
    this.productService.getOrders().subscribe({
      next: (res: any) => {
        const rawOrders = Array.isArray(res) ? res : [];

        this.recentOrders = rawOrders.map((ord: any) => {
          const custName = ord.customerName ?? ord.CustomerName ?? ord.customer?.name ?? ord.customer?.Name;

          return {
            orderID: ord.orderID ?? ord.OrderID ?? ord.id,
            customerName: (custName && custName.trim() !== '') ? custName : 'Walk-in Customer',
            totalAmount: ord.totalAmount ?? ord.TotalAmount ?? 0,
            orderDate: ord.orderDate ?? ord.OrderDate ?? ord.created_at
          };
        });
      },
      error: (err) => console.error('Error fetching orders:', err)
    });
  }

  addToCart(): void {
    if (!this.selectedCustomerId) {
      Swal.fire({
        icon: 'warning',
        title: 'Customer Missing 👤',
        text: 'Pehle Customer select karein!',
        background: '#0f172a',
        color: '#f8fafc'
      });
      return;
    }

    if (!this.selectedProduct) {
      Swal.fire({
        icon: 'warning',
        title: 'Product Missing 📦',
        text: 'Pehle Product select karein!',
        background: '#0f172a',
        color: '#f8fafc'
      });
      return;
    }

    if (this.inputQuantity <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Quantity 🔢',
        text: 'Quantity kam se kam 1 honi chahiye!',
        background: '#0f172a',
        color: '#f8fafc'
      });
      return;
    }

    const prod = this.selectedProduct;
    const pId = Number(prod.pid ?? prod.PID ?? prod.productID ?? prod.ProductID ?? prod.id ?? 0);
    const pName = prod.name || prod.Name || prod.productName || prod.ProductName || 'Selected Product';
    const pPrice = Number(prod.price || prod.Price || 0);
    const qty = Number(this.inputQuantity);

    const existingIndex = this.cart.findIndex(item => item.pid === pId && pId !== 0);

    if (existingIndex > -1) {
      const updatedCart = [...this.cart];
      updatedCart[existingIndex].quantity += qty;
      updatedCart[existingIndex].subTotal = updatedCart[existingIndex].quantity * pPrice;
      this.cart = updatedCart;
    } else {
      const newItem: CartItem = {
        pid: pId,
        productName: pName,
        price: pPrice,
        quantity: qty,
        subTotal: pPrice * qty
      };
      this.cart = [...this.cart, newItem];
    }

    this.recalculateTotal();
    this.selectedProduct = null;
    this.inputQuantity = 1;
  }

  updateItemQty(index: number, newQty: number): void {
    const qty = Number(newQty);
    if (qty <= 0) {
      this.removeItem(index);
      return;
    }
    const updatedCart = [...this.cart];
    updatedCart[index].quantity = qty;
    updatedCart[index].subTotal = qty * updatedCart[index].price;
    this.cart = updatedCart;
    this.recalculateTotal();
  }

  removeItem(index: number): void {
    this.cart = this.cart.filter((_, i) => i !== index);
    this.recalculateTotal();
  }

  clearCart(): void {
    this.cart = [];
    this.grandTotal = 0;
  }

  recalculateTotal(): void {
    this.grandTotal = this.cart.reduce((sum, item) => sum + item.subTotal, 0);
  }

  submitOrder(): void {
    if (!this.selectedCustomerId) {
      Swal.fire({
        icon: 'warning',
        title: 'Customer Missing 👤',
        text: 'Customer select karein!',
        background: '#0f172a',
        color: '#f8fafc'
      });
      return;
    }
    if (this.cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Cart 🛒',
        text: 'Cart khali hai!',
        background: '#0f172a',
        color: '#f8fafc'
      });
      return;
    }

    this.isSubmitting = true;

    const payload = {
      CustId: Number(this.selectedCustomerId),
      Items: this.cart.map(item => ({
        PID: Number(item.pid),
        Quantity: Number(item.quantity)
      }))
    };

    this.productService.createOrder(payload).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Order Placed! 🎉',
          text: res.message || 'Order Placed Successfully!',
          timer: 2000,
          showConfirmButton: false,
          background: '#0f172a',
          color: '#f8fafc'
        });
        this.clearCart();
        this.selectedCustomerId = null;
        this.isSubmitting = false;
        this.fetchAllData();
      },
      error: (err) => {
        console.error('Submit error:', err);
        const errorMsg = err.error?.message || 'Order place nahi ho saka.';
        Swal.fire({
          icon: 'error',
          title: 'Order Failed ❌',
          text: errorMsg,
          background: '#0f172a',
          color: '#f8fafc'
        });
        this.isSubmitting = false;
      }
    });
  }

  deleteOrder(id: number): void {
    Swal.fire({
      title: 'Are you sure? ⚠️',
      text: `Do you want to cancel Order #${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, cancel it! 🗑️',
      cancelButtonText: 'Cancel',
      background: '#0f172a',
      color: '#f8fafc'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteOrder(id).subscribe({
          next: (res: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted! ✅',
              text: res.message || 'Order Deleted',
              timer: 1500,
              showConfirmButton: false,
              background: '#0f172a',
              color: '#f8fafc'
            });
            this.fetchAllData();
          },
          error: (err) => {
            console.error('Delete error:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error ❌',
              text: 'Order delete nahi hua.',
              background: '#0f172a',
              color: '#f8fafc'
            });
          }
        });
      }
    });
  }
}