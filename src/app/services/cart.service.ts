import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Global property
  cart = new BehaviorSubject<Cart>({ items: [] });

  constructor(private _snackBar: MatSnackBar) {

  }

  addToCart(item: CartItem): void {
    // Destrcuture the old object by creating new array
    const items = [...this.cart.value.items];

    // Avoid duplicating cart
    const itemInCart = items.find((_item) => _item.id === item.id);

    // Just increase it's quantity
    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item) // append at the end of existing.
    }

    this.cart.next({ items });
    this._snackBar.open('1 item added to cart', 'Ok', { duration: 3000 });

    // console.log(this.cart.value);
  }

  removeQuantity(item: CartItem): void{
    let itemForRemoval: CartItem | undefined;

    // Loop through the array.
    let filteredItems = this.cart.value.items.map((_item) => {
      if (_item.id === item.id) {
        _item.quantity--;

        // If quantity == 1, remove the item from cart and delete row
        if (_item.quantity === 0) {
          itemForRemoval = _item;
        }
      }
      return _item;
    });

    if (itemForRemoval) {
      filteredItems = this.removeFromCart(itemForRemoval, false);
    }

    this.cart.next({ items: filteredItems });
    this._snackBar.open('1 item removed from cart', 'OK', { duration: 3000 });
  }

  // Obtain all items in the cart item array and multiply by their individual prices.
  getTotal(items: Array<CartItem>): number {
    return items.map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  clearCart(): void {
    this.cart.next({ items: [] });
    this._snackBar.open('Cart is cleared', 'OK',
      { duration: 3000 });
  }

  // Update cart object and emit it
  removeFromCart(item: CartItem, update = true): Array<CartItem>{
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );
    // Update
    if (update) {
      this.cart.next({ items: filteredItems });
      this._snackBar.open('1 item remove from cart', 'OK', { duration: 3000 });
    }
    return filteredItems;
  }
}
