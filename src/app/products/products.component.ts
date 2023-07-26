import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  public products :Array<Product>=[];
  public keyword : string="";
  public productPage: string|null=null;
  public sizeOfProducts:number=5;
  public totalProducts:number=0;
  public listOfPages:Array<any>=new Array();
  constructor(private productService:ProductService, private route:ActivatedRoute, private router:Router) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe( paramMap => {
      this.productPage = paramMap.get('productPage');
      if(this.productPage==null) this.productPage = "1";
      let page = +this.productPage;
      if(page<1)
        this.router.navigateByUrl("/products/1")
      this.getProducts();
  })
  }

  getProducts(){
    
    this.productService.getProducts(+this.productPage!,this.sizeOfProducts)
      .subscribe({
        next : data => {
          this.products=[];
          data.body?.forEach(p=>this.products.push(p))
          let X_Total_Count = data.headers.get('X-Total-Count');
          if(X_Total_Count!=null)
            this.totalProducts=+X_Total_Count;
          this.listOfPages = new Array(Math.ceil(this.totalProducts/this.sizeOfProducts));
          console.log(this.totalProducts+" ,jxnzjnxz, "+JSON.stringify(this.listOfPages))
        },
        error : err => {
          console.log(err);
        }
      })

    //this.products=this.productService.getProducts();
  }


  handleCheckProduct(product: Product) {
    this.productService.checkProduct(product).subscribe({
      next :updatedProduct => {
        product.checked=!product.checked;
        //this.getProducts();
      }
    })
  }

  handleDelete(product: Product) {
    if(confirm("Etes vous sûre?"))
    this.productService.deleteProduct(product).subscribe({
      next:value => {
        //this.getProducts();
        this.products=this.products.filter(p=>p.id!=product.id);
      }
    })
  }

  searchProducts() {
    this.productService.searchProducts(this.keyword).subscribe({
      next : value => {
        this.products=value;
      }
    })
  }
}
