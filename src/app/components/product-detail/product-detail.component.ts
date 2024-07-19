import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { AuthSeviceService } from 'src/app/services/auth-sevice.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthSeviceService 
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const authKey = this.authService.getAuthKey(); 

    if (id && authKey) {
      this.productService.getProductById(id, authKey).subscribe(data => {
        this.product = data;
      });
    }
  }

}
