import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/product.service';
import { AuthSeviceService } from 'src/app/services/auth-sevice.service';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { AddProductComponent } from '../add-product/add-product.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  displayedColumns: string[] = ['index', 'sku', 'name', 'cost', 'actions']; 
  authKey: string = ''; 
  showAddProductForm = false;

  constructor(
    private productService: ProductService,
    private authService: AuthSeviceService,
    private router: Router,
    private dialog: MatDialog ) { }

  ngOnInit() {
    this.refreshProducts();
  }

  refreshProducts(): void {
    const authKey = this.authService.getAuthKey();
    if (authKey) {
      this.productService.getProducts(authKey).subscribe(data => {
        this.products = data;
        console.log(this.products);
      });
    } else {
      alert('No authorization key found. Please login.');
    }
  }

  openAddProductDialog(product?: any) {
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '400px',
      data: { product } // Pasar el producto al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.refreshProducts(); // Actualizar la lista de productos
      }
    });
  }


  viewProductDetails(product: any) {
     this.router.navigate(['/products', product.id]);
  }

  editProduct(product: any) {
    this.openAddProductDialog(product);
  }

  deleteProduct(productId: number): void {
    const authKey = this.authService.getAuthKey();
    
    if (confirm('Are you sure you want to delete this product?')) {
        if (authKey) {
        this.productService.deleteProduct(productId, authKey).subscribe(
          () => {
            this.products = this.products.filter(product => product.id !== productId);
          },
          error => {
            console.error('Error al eliminar el producto:', error);
          }
        );
      } else {
        alert('No authorization key found. Please login.');
      }
    }
    
  }


  

}
