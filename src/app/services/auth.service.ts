import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private _snackBar:MatSnackBar, private _http:HttpClient) { }

  openSnackBar(message:any, action: any = 'OK'){
    this._snackBar.open(message,action,{duration:3000,verticalPosition:'bottom'

    })
  }

  validateToken(token:string):Observable<boolean>{
    // const bearerToken = "Bearer "+token;
    return this._http.post<boolean>('http://localhost:8080/api/validate-token', { token });
  }
  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return new Observable<boolean>((observer) => {
        observer.next(false);
        observer.complete();
      });
    }

    return this.validateToken(token);
  }
  addUser(data: any):Observable<any>{
    return this._http.post('http://localhost:8080/api/users',data)
  }

  getUsers():Observable<any>{
    return this._http.get('http://localhost:8080/api/users');
  }

  updateUserDetails(id:number,data:any):Observable<any>{
    return this._http.put(`http://localhost:8080/api/users/${id}`,data)
  }

  deleteUser(id:number):Observable<any>{
    return this._http.delete(`http://localhost:8080/api/users/${id}`)
  }
  Islogged(data: any):Observable<any>{
      return this._http.post("http://localhost:8080/api/login",data);
     }

  loggedIn(){
    return sessionStorage.getItem('username')!=null;
  }
}
