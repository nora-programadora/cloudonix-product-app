import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { AuthSeviceService } from 'src/app/services/auth-sevice.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  authKey: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthSeviceService,
    public dialogRef: MatDialogRef<AddProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: any }
  ) {
    this.productForm = this.fb.group({
      name: [data.product ? data.product.name : '', Validators.required],
      description: [data.product ? data.product.description : '', Validators.required],
      cost: [data.product ? data.product.cost : '', [Validators.required, Validators.min(0)]],
      type: [data.product && data.product.profile ? data.product.profile.type : 'furniture'],
      available: [data.product && data.product.profile ? data.product.profile.available : true],
      backlog: [data.product && data.product.profile ? data.product.profile.backlog : '']
    });
    

    const key = this.authService.getAuthKey();
    this.authKey = key ? key : ''; 
  }

  ngOnInit(): void {}

  saveProduct() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const productData = {
        name: formValue.name,
        description: formValue.description,
        cost: formValue.cost,
        profile: {
          type: formValue.type,
          available: formValue.available,
          backlog: formValue.backlog
        }
      };

      if (this.data.product) {
        // Edit product
        this.productService.updateProduct(this.data.product.id, productData, this.authKey).subscribe(() => {
          this.dialogRef.close('saved');
        });
      } else {
        // Add new product
        this.productService.addProduct(productData, this.authKey).subscribe(() => {
          this.dialogRef.close('saved');
        });
      }
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
