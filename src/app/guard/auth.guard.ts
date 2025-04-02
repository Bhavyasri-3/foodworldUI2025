import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private service:AuthService,private _route:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.service.loggedIn()){
        this.service.isAuthenticated().pipe(
         map((isValid)=>{
           console.log("is valid",isValid);
           if(!isValid){
             console.log("redirect to login , token invalid");
             this._route.navigate(['login']);
             console.log("redirect to login , token invalid111");
             return false;
           }else{
             return true;
           }
         })
       )
     }else{
       this._route.navigate(['login']);
       return false;
     }
   return true;
 }
  }
  
