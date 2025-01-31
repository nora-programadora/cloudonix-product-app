import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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
      sku: [data.product ? data.product.sku : '', Validators.required],
      cost: [data.product ? data.product.cost : '', [Validators.required, Validators.min(0)]],
      type: [data.product && data.product.profile ? data.product.profile.type : 'furniture'],
      available: [data.product && data.product.profile ? data.product.profile.available : true],
      backlog: [data.product && data.product.profile ? data.product.profile.backlog : ''],
      customProperties: this.fb.array([])
    });

    const key = this.authService.getAuthKey();
    this.authKey = key ? key : '';

    if (data.product && data.product.profile && data.product.profile.customProperties) {
      this.initializeCustomProperties(data.product.profile.customProperties);
    }
  }

  ngOnInit(): void {}

  get customProperties(): FormArray {
    return this.productForm.get('customProperties') as FormArray;
  }

  initializeCustomProperties(properties: { key: string, value: string }[]) {
    const customPropertiesFGs = properties.map(prop => this.fb.group({
      key: [prop.key, Validators.required],
      value: [prop.value, Validators.required]
    }));
    const customPropertiesFormArray = this.fb.array(customPropertiesFGs);
    this.productForm.setControl('customProperties', customPropertiesFormArray);
  }

  saveProduct() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const productData = {
        name: formValue.name,
        description: formValue.description,
        sku: formValue.sku,
        cost: formValue.cost,
        profile: {
          type: formValue.type,
          available: formValue.available,
          backlog: formValue.backlog,
          customProperties: formValue.customProperties
        }
      };

      // Verificar la estructura del objeto antes de enviarlo
      console.log('Product Data:', JSON.stringify(productData, null, 2));

      if (this.data.product) {
        // Edit product
        this.productService.updateProduct(this.data.product.id, productData, this.authKey).subscribe(
          () => {
            this.dialogRef.close('saved');
          },
          (error) => {
            console.error('Update Product Error:', error); // Registrar el error
          }
        );
      } else {
        // Add new product
        this.productService.addProduct(productData, this.authKey).subscribe(
          () => {
            this.dialogRef.close('saved');
          },
          (error) => {
            console.error('Add Product Error:', error); // Registrar el error
          }
        );
      }
    }
  }



  closeDialog() {
    this.dialogRef.close();
  }

  addCustomProperty() {
    this.customProperties.push(this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required]
    }));
  }

  removeCustomProperty(index: number) {
    this.customProperties.removeAt(index);
  }
}
