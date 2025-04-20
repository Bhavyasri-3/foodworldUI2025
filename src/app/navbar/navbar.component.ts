import { ChangeDetectorRef, Component, OnInit, DoCheck } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddUserComponent } from '../add-user/add-user.component';
import { HomeService } from '../services/home.service';
import { CartService } from '../services/cart.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, DoCheck {
  ismenurequired=false;
  username='';
  isAdminLoggedin:any;
  isBackiconrequired=false;
  totalItemsCount =0;
  constructor(private router:Router, private _dialog:MatDialog,
    private homeService:HomeService,
  private cdr: ChangeDetectorRef,private cartService:CartService){
    // this.isAdminLoggedin = sessionStorage.getItem('isAdminLoggedIn')
    // this.username = sessionStorage.getItem('username') || '';
    
  }

  ngOnInit(){
    this.homeService.username$.subscribe(name=>{
      this.username=name;
    })
    this.homeService.isAdmin$.subscribe(isAdmin=>{
      this.isAdminLoggedin = isAdmin;
    })
    this.cartService.totalItems$.subscribe(total=>{
      this.totalItemsCount=total;
    })
  }
ngDoCheck(): void {
   const currentUrl = this.router.url;
   if(currentUrl=='/login' || currentUrl=='/register'){
    this.ismenurequired=false
   }else{
    this.ismenurequired=true;
   }

   if(currentUrl == '/home'){
    this.isBackiconrequired = false
   }else{
    this.isBackiconrequired = true;
   }
  }
  openUserForm(){
    this._dialog.open(AddUserComponent)
  }

  logout(): void {
    sessionStorage.clear();
    this.isAdminLoggedin = false;
    this.router.navigate(['/login']);
  }
  
}
