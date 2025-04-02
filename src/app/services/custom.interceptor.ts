import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('Token');
    console.log("Retrieved Token:", token);
    if(!token){
      return next.handle(request);
    }
    const newCloneRequest = request.clone({
      setHeaders:{
        Authorization : `Bearer ${token}`
      }
    })
    console.log("Outgoing Request Headers:", newCloneRequest.headers.get('Authorization'));
    return next.handle(newCloneRequest);
  }
}
