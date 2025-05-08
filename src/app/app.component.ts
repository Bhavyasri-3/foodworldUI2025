import {  Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Rest-App app is running!';
  isAuthenticated = false;
  constructor( private authService:AuthService){
  }
 
  ngOnInit(){
    this.authService.isAuthenticated().subscribe((valid)=>{
      this.isAuthenticated = valid;
      
    })
  }
    
    
}
