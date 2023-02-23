import { HttpClient } from '@angular/common/http';
import { CartService } from 'src/app/services/cart.service';
import { Component, OnInit } from '@angular/core';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  // Dummy cart data
  cart: Cart = {
    items: [{
      product: "../../../assets/map.png",
      name: "Maps",
      price: 3000,
      quantity: 1,
      id: 1,
    },
    {
      product: "../../../assets/map.png",
      name: "Maps",
      price: 3000,
      quantity: 3,
      id: 2,
    },
    {
      product: "../../../assets/map.png",
      name: "Maps",
      price: 3000,
      quantity: 1,
      id: 3,
    }]
  };
  // Datasource property
  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action',
  ];
  constructor(private cartService: CartService, private http: HttpClient) { }

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    })

  }
  // Obtain all items in the cart item array and multiply by their individual prices.
  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }
  // Clear all
  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  // Add & remove one by one to/from cart
  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onCheckOut(): void {
    this.http.post('http://localhost:4242/checkout', {
      items: this.cart.items
    }).subscribe(async (res: any) => {
      let stripe = await loadStripe('pk_test_51M2rd7BPljLkxUJOCocNLHoB79sQOB9KmEpFzvtDEVjRTTP9lx66NIauZjCy3THoUNzchlHANHPVr0Atpw7LXjBX00asnaymOv');
      stripe?.redirectToCheckout({
        sessionId: res.id
      })
    })
  }
}
