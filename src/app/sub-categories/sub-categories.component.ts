import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../services/home.service';
import {  MatDialog } from '@angular/material/dialog';
import { AddSubCategoriesComponent } from '../add-sub-categories/add-sub-categories.component';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.css']
})
export class SubCategoriesComponent implements OnInit {
  subCategoryItems: any = [];
  categoryTitle: string | null = null;
  isAdminLoggedin: any;
  cartItems: any[] = [];
  constructor(private route: ActivatedRoute,
    private homeService: HomeService,
    private dialog: MatDialog,
    private cartService: CartService) { 
       
    }

  ngOnInit() {
    this.isAdminLoggedin = sessionStorage.getItem('isAdminLoggedIn');
    this.cartService.cartItems$.subscribe(items=>{
      this.cartItems=items;
      
    })
    this.route.paramMap.subscribe(params => {
      this.categoryTitle = params.get('category');
      this.loadSubCategories();

    })
  }

  loadSubCategories() {
    this.homeService.getSubCategoryItems().subscribe({
      next: (data: any) => {
        this.subCategoryItems = data.filter((item: any) => item.categoryName === this.categoryTitle)
          .map((item: any) => { 
            const cartItem = this.cartItems.find(cart=> cart.itemId === item.itemId);
            return {...item,count : cartItem ? cartItem.count:0}
          });
        console.log("subCategoryItems",this.subCategoryItems);
      },
      error: (err) => {
        console.log(err);

      }
    })
  }

  opensubCategoryForm() {
    this.dialog.open(AddSubCategoriesComponent, {
      data: { categoryTitle: this.categoryTitle }
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.loadSubCategories();
      }
    })
  }
  decreaseCount(index: number) {
    if (this.subCategoryItems[index].count > 0) {
      this.subCategoryItems[index].count--;
      if (this.subCategoryItems[index].count > 0) {
        this.cartService.updateItemQuantity(this.subCategoryItems[index],this.subCategoryItems[index].count);
      }else{
        this.cartService.removeItem(this.subCategoryItems[index]);
      }
    }
  }
  increaseCount(index: number) {
    this.subCategoryItems[index].count++;
    if (this.subCategoryItems[index].count > 0) {
      this.cartService.updateItemQuantity(this.subCategoryItems[index], this.subCategoryItems[index].count)
      // this.subCategoryItems[index].count = 0;
    }
  }

  editSubCategoryForm(index: number) {
    const data = this.subCategoryItems[index];
    this.dialog.open(AddSubCategoriesComponent, {
      data: {
        ...data, categoryTitle: this.categoryTitle
      }
    }).afterClosed().subscribe((result) => {
      this.loadSubCategories();
    })
  }

}
