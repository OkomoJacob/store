import { StoreService } from './../../services/store.service';
import { Product } from './../../models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {

  // Template variables
  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  category: string | undefined;
  products: Array<Product> | undefined;
  sort = 'desc';
  count = '10';
  productsSubscription: Subscription | undefined;

  // Injecting services in constructor
  constructor(private cartService: CartService, private storeService: StoreService) { }


  ngOnInit(): void {
    this.getProducts();
  }

  // Update fakestore products
  getProducts(): void {
    this.productsSubscription = this.storeService.getAllProducts(this.count, this.sort, this.category).subscribe((_products) => {
      this.products = _products;
    })
  }

  onColumnsCountChange(colsNum: number) {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.getProducts();
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    })
  }

  onItemsCountChange(newCount: number): void{
    this.count = newCount.toString();
    this.getProducts; // Fetch again
  }

  onSortChange(newSort: string): void{
    this.sort = newSort;
    this.getProducts; // Fetch again
  }
  
  // Destroy the subscriptions to avoid multiple API calls and subscriptions on refresh.
  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
    // throw new Error('Method not implemented.');
  }
}
