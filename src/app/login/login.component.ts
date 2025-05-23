import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { JwtService } from '../services/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  username: string | null = null;
  userdata: any;
  isAdminLoggedIn = false;
  isLoading = false;
  constructor(private fb: FormBuilder, private router: Router,
    private _auth: AuthService, private jwtService: JwtService) {
    sessionStorage.clear();
    localStorage.clear();
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  get Username() {
    return this.loginForm.get('username');
  }

  get Password() {
    return this.loginForm.get('password');
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this._auth.Islogged(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res) {
            // this.userdata = res;
            localStorage.setItem('Token', res.token)
            const token = localStorage.getItem('Token');
            if (token) {
              this.username = this.jwtService.getUsernameFromToken(token)
              console.log("Extracted Username:", this.username);
            } else {
              console.log("No JWT Token found.");
            }
            if (this.username === 'admin123') {
              this.isAdminLoggedIn = true;
              sessionStorage.setItem('username', this.loginForm.value.username);
              sessionStorage.setItem('isAdminLoggedIn', 'true');
              this._auth.openSnackBar("Admin Login Successfully");
              this.router.navigate(['/welcome']).then(() => {
                // window.location.reload();
              });
            } else {
              sessionStorage.setItem('username', this.loginForm.value.username);
              this._auth.openSnackBar("Logged In Successfully");
              this.router.navigate(['/welcome']).then(() => {
                window.location.reload();
              });
            }
          } else {
            this._auth.openSnackBar("Invalid Credentials", "Try Again");
          }
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status === 401) {
            this._auth.openSnackBar("Invalid Credentials", "Try Again");
          } else {
            console.error(err);
            this._auth.openSnackBar("An error occurred", "Please try again later");
          }
        }
      });
    } else {
      this._auth.openSnackBar("Please fill in all required fields", "Try Again");
    }
  }

}
