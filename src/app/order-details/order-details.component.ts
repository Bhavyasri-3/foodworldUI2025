import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HomeService } from '../services/home.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../services/cart.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  isAdminLoggedin: any;
  userName: any;
  isLoading = false;
  selectedFilter!: string;
  startDate: Date | null = null;
  endDate: Date | null = null;
  filteredOrders: any[] = [];
  totalPrice = 0;
  isFilterApplied = false;
  showFooter =false;
  today: Date = new Date();
  orderItems: any[] = [];
  displayedColumns: string[] = [
    "tableNumber",
    "orderStatus",
    "orderAction",
    "actions",
  ]
  footerColumns: string[] = ['totalOrdersFooter', 'totalPriceFooter'];
  
  dateForm = new FormGroup({
    startDate: new FormControl<Date | null>(null, Validators.required),
    endDate: new FormControl<Date | null>(null, Validators.required)
  })

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private homeService: HomeService, private dialog: MatDialog,
    private authService: AuthService, private router: Router, private cartService: CartService) {
    this.dateForm.controls.startDate.valueChanges.subscribe(() => this.validateDates());
    this.dateForm.controls.endDate.valueChanges.subscribe(() => this.validateDates());
  }

  ngOnInit() {
    this.isAdminLoggedin = sessionStorage.getItem('isAdminLoggedIn')
    const username = sessionStorage.getItem('username');
    if (username) {
      this.userName = username;
    } else {
      console.log('No username found in sessionStorage.');
    }

    if (this.isAdminLoggedin === 'true') {
      this.loadOrderDetails();
    } else {
      this.getOrderDetailsByUserName();
    }
  }

  loadOrderDetails() {
    this.isLoading = true;
    this.homeService.getOrderDetails().subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log("getOrderDetails", res);

        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err);

      }
    })
  }

  onFilterChange(filter: string) {
    console.log("selectedFilter", this.selectedFilter);
    this.selectedFilter = filter;
    if (this.selectedFilter !== 'custom') {
      this.fetchFilterOrders();
    }
  }
  formatDate(date: Date): string {
    if (!date) return '';

  const offset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - offset);

  return localDate.toISOString().split('T')[0];
  }

  fetchFilterOrders() {
    this.isLoading = true;
    const params: any = {};
    const today = new Date();

    switch (this.selectedFilter) {
      case 'day':
        params.startDate = this.formatDate(today);
        params.endDate = this.formatDate(today);
        break;

      case 'week':
        const lastweek = new Date();
        lastweek.setDate(today.getDate() - 7);
        params.startDate = this.formatDate(lastweek);
        params.endDate = this.formatDate(today);
        break;

      case 'month':
        const lastmonth = new Date();
        lastmonth.setDate(today.getDate() - 30);
        params.startDate = this.formatDate(lastmonth);
        params.endDate = this.formatDate(today);
        break;

      case 'custom':
        const startDate = this.dateForm.controls.startDate.value;
        const endDate = this.dateForm.controls.endDate.value;

        if (!startDate || !endDate) {
          alert("Please select both start and end dates");
          this.isLoading = false;
          break;
        }
        params.startDate = this.formatDate(startDate);
        params.endDate = this.formatDate(endDate);
        break;
    }
  
    this.homeService.getFilteredOrders(params).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.filteredOrders = res;
        this.totalPrice = this.calculateTotalPrice(res);
        this.showFooter = this.filteredOrders.length > 0;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error("Error fetching filtered orders:", err);
        this.isLoading = false;

      }
    })
  }

  calculateTotalPrice(orders: any[]):number{
    let total = 0;
  
    for(const order of orders){
      if(order.orderItems && Array.isArray(order.orderItems)){
        for(const item of order.orderItems){
          const price = parseFloat(item.itemPrice);
          const quantity = item.quantity || 1;
          total += price * quantity; 
        }
      }
    }
    const gst = total * 0.05;
    const totalWithGst = total +gst;
  
    return parseFloat(totalWithGst.toFixed(2));
  }
  validateDates() {
    const startDate = this.dateForm.controls.startDate.value;
    const endDate = this.dateForm.controls.endDate.value;

    this.dateForm.controls.startDate.setErrors(null);
    this.dateForm.controls.endDate.setErrors(null);

    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        this.dateForm.controls.startDate.setErrors({ invalidStart: true });
      }
      if (new Date(endDate) > this.today) {
        this.dateForm.controls.endDate.setErrors({ invalidEnd: true });
      }
    }
  }

  deleteOrderDetails(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent)
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.isLoading = true;
        this.homeService.deleteOrder(id).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.authService.openSnackBar("Order Deleted Successfully")
            this.loadOrderDetails();
          }
        })
      } else {
        this.authService.openSnackBar("Delete Action canceled", "cancel")
      }
    })

  }

  openEditOrderDetails(orderId: number) {
    this.homeService.getOrderDetailsByOrderId(orderId).subscribe({
      next: (order) => {
        console.log('Order items fetched from backend:', order);
        this.orderItems = order;
        // Transform the backend response

        const transformedItems = this.orderItems.map((item: any) => ({
          categoryName: item.categoryName,
          count: item.quantity, // Map 'quantity' to 'count'
          itemId: item.itemId,
          itemImage: item.itemImage,
          itemName: item.itemName,
          itemPrice: item.itemPrice,
          itemstatus: item.itemstatus,
          tableNumber: item.tableNumber,
          orderId: item.orderId
        }));

        console.log('Transformed order items:', transformedItems);

        // Save transformed items to storage
        this.cartService.saveCartToStorage(transformedItems);
        this.router.navigate(['/home'], { queryParams: { orderId } }).then(() => {
          window.location.reload();
        });
      },
      error: (err: any) => {
        console.error('Error fetching order details:', err);
      }
    });
  }


  viewOrders(orderId: number) {
    this.router.navigate(['view-orders'], { queryParams: { orderId } })
  }

  getOrderDetailsByUserName() {
    console.log("getOrderDetailsByUserName method called", this.userName);
    this.homeService.getOrderDetailsByUserName(this.userName).subscribe({
      next: (res) => {
        console.log("getOrderDetailsByUserName", res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
