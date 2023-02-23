
# AnguShop Store Project(Beginner Sample mini project)
This angushop project, named `store` was a mini project to help me undersand given cioncepts in building a full stack app.
### Techs Used in this Build:
- [x] Angular14, Angular Material UI, NodeJS, ExpressJS
- [x] TypeScript,  
- [x] Stripe for Payment Intergration, 
- [x] TailwindCSS: For inline styling

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.3.
## Set up your Dev Environment,
#### Install the Angular CLI
- The Angular CLI is a command-line interface tool that you use to initialize, develop, scaffold, and maintain Angular applications directly from a command shell.

```
npm i -g @angular/cli
```
- Then now ceate a new `store` app, enable routing and skip the tests in develope mode(Otherwise unflag the tests for prod). You might opt to keep the application to minimal as I did below.

```
ng new store --routing --skip-tests --minimal
```

## Start the live Development server and open the app on Developement mode.

Run 
```shell
ng serve -o
``` 
- This will automatically deploy your app to  `http://localhost:4200/` in your default browser. 

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Sample Code snippets to get you going

### Adding items from Cart

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  }

  addToCart(item: CartItem): void {
    // Destrcuture the old object by creating new array
    const items = [...this.cart.value.items];

    // Avoid duplicating cart
    const itemInCart = items.find((_item) => _item.id === item.id);

    // Increament an item with same id when re-added to cart.
    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item) // append at the end of existing.
    }

    this.cart.next({ items });
    this._snackBar.open('1 item added to cart', 'Ok', { duration: 3000 });
}
```
### Remove items from Cart
- A buyer might opt to remove item from cart or even clear the entrire cart.
- Upon such, this fucntion will be invocked fro the services folder.

```typescript
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
  }
```

### Snackbars.
It's normally a good User Experience(UX) to pop-notify the user when something hjas haoppened. Angular Snackbar helps notify as such.
- Take a loo:

```typescript
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class CartService {

}
  // Global property
  cart = new BehaviorSubject<Cart>({ items: [] });
  constructor(private _snackBar: MatSnackBar) {
  }

this._snackBar.open('Item removed from cart', 'OK', { duration: 2000 });
```

### Server, Node & ExpressJS

[Express.js](https://expressjs.com/), or simply Express, is a back end web application framework for building RESTful APIs with Node.js. It is designed for building web applications and APIs. 
To intergrate NodeJs server rendering, I used Express & Cors to integrate the Stripe payment API . Install express as below:

```shell
npm init -y
```

```shell
npm install cors@2.X express@4.X stripe@10.X
```
- Simple express server used in this build.

```javascript
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");

// Initialize the express app
const app = express();

app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors({ origin: true, credentials: true }));

// Load stripe
const stripe = require("stripe")(
  "sk_test_51MYOUR_STRIPE_API_KEYW4"
);
```

## Check out the Official Documentation here

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Resources
1. [Angular Material, Material Design components for Angular](https://material.angular.io/)
2. [Tailwind css, Get started with Tailwind CSS](https://tailwindcss.com/)
3. [Stripe](https://stripe.com/)
4. [Stripe Checkout payments](https://stripe.com/docs/checkout/quickstart)
5. [ExpressJS/Express](https://expressjs.com/)