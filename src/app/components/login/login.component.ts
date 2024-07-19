import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { AuthSeviceService } from 'src/app/services/auth-sevice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authKey: string = '';

  constructor(private authService: AuthSeviceService, private router: Router) {}

  onLogin() {
    if (this.authKey.trim()) {
      this.authService.setAuthKey(this.authKey);
      this.router.navigate(['/products']);
    } else {
      alert('Authorization key is required');
    }
  }

}
