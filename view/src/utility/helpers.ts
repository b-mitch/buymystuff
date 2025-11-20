import { useState } from 'react';

export function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    if (!tokenString) return null;
    const userToken = JSON.parse(tokenString);
    return userToken?.token || null;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken: any): void => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token
  }
}

export function useSearch() {
  const getSearch = () => {
    const searchString = sessionStorage.getItem('search');
    if (!searchString) return undefined;
    const search = JSON.parse(searchString);
    return search?.search;
  };

  const [search, setSearch] = useState(getSearch());

  const saveSearch = (userSearch: any): void => {
    sessionStorage.setItem('search', JSON.stringify(userSearch));
    setSearch(userSearch.search);
  };

  return {
    setSearch: saveSearch,
    search
  }
}

export function setCheckoutSession(value: any): void {
  const checkoutString = sessionStorage.getItem('checkout');
  const prevData = checkoutString ? JSON.parse(checkoutString) : {};
  Object.assign(prevData, value);
  sessionStorage.setItem('checkout', JSON.stringify(prevData));
}

export function addToCartLocal(item: any): any[] {
  let cart: any[] = [];
  const cartString = localStorage.getItem('cart');
  const currentCart = cartString ? JSON.parse(cartString) : null;
  if(!currentCart){
    cart[0]=item;
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  }
  cart = currentCart || [];
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  return cart;
}

export async function localCartTotal(): Promise<number | undefined> {
  const cartString = localStorage.getItem('cart');
  if (!cartString) return undefined;
  const cart = JSON.parse(cartString);
  if(!cart) return undefined;
  const stringPriceArray: number[] = [];
  for (let item of cart) {
    let price = await getProductPrice(item.name);
    const priceNum = Number(price);
    const amount = item.amount;
    const cost = priceNum * amount;
    stringPriceArray.push(cost);
  }
  const total = stringPriceArray.reduce((x, y) => x+y, 0);
  return total;
}

export async function addLocalCartToDB(token: string): Promise<void> {
  const cartString = localStorage.getItem('cart');
  if (!cartString) return;
  const cart = JSON.parse(cartString);
  if (!cart) return;
  try {
    for (let item of cart) {
      await addToCartDB(item.name, token, item.amount);
    }
  } catch(error) {
    console.log('error');
  }
}

export async function noLoginCheckout(): Promise<void> {
  const idArray: any[] = [];
  const cartString = localStorage.getItem('cart');
  if (!cartString) return;
  const cart = JSON.parse(cartString);
  if (!cart) return;
  try {
    for (let item of cart) {
      const results = await fetch(`/products/${item.name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({amount: item.amount})
      });
      const json = await results.json();
      idArray.push(json);
      localStorage.setItem('cart-ids', JSON.stringify(idArray));
    }
  } catch(error) {
    console.log('error');
  }
}

export function useAuth(): boolean | undefined {
  const token = sessionStorage.getItem("token");
  if(token){
    return true;
  }
}

export async function createUser(credentials: any): Promise<any> {
  return fetch('/register' , {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json());
}

export async function updateDetails(token: string | null, credentials: any): Promise<any> {
  if(!token){
    return;
  }
  return fetch('/account/details' , {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json());
}

export async function updatePassword(token: string | null, credentials: any): Promise<any> {
  if(!token){
    return;
  }
  return fetch('/account/password' , {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json());
}

export async function loginUser(credentials: any): Promise<any> {
  return fetch('/login' , {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json())
}

export async function getUser(token: string | null): Promise<any> {
  if(!token){
    return;
  }
  return fetch('/account', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    }
  })
  .then(data => data.json())
}

export async function getProductsOfCategory(category: string): Promise<any> {
  return fetch(`/products/c/${category}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(data => data.json())
}

export async function getProduct(product: string | undefined): Promise<any> {
  return fetch(`/products/${product}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
  .then(data => data.json())
}

export async function getProductPrice(product: string): Promise<any> {
  return fetch(`/products/${product}/price`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(data => data.json())
}

export async function getAllProducts(): Promise<any> {
  return fetch('/products', {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(data => data.json())
}

export async function updateProducts(credentials: any, token: string): Promise<any> {
  return fetch('/checkout', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json())
}

export async function addToCartDB(product: string, token: string, amount: number): Promise<any> {
  return fetch(`/products/${product}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({amount: amount})
  })
  .then(data => data.json());
}

export async function getCart(token: string): Promise<any> {
  return fetch('/cart', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    }
  })
  .then(data => data.json())
}

export async function getCartTotal(token: string): Promise<any> {
  return fetch('/cart/total', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    }
  })
  .then(data => data.json())
}

export async function updateCart(id: string, amount: number): Promise<any> {
  return fetch(`/cart/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({amount: amount})
  })
  .then(data => data.json())
}

export async function deleteFromCartDB(id: string): Promise<number> {
  return fetch(`/cart/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(data => data.status)
}

export async function deleteCart(credentials: any, token: string): Promise<number> {
  return fetch(`/checkout`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    "Authorization": token
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.status)
}

export async function createOrder(credentials: any, token: string | number): Promise<any> {
  return fetch('/checkout' , {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": String(token)
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json());
}

export async function getOrders(token: string): Promise<any> {
  return fetch('/orders', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
  })
  .then(data => data.json())
}

export async function getOrderDetails(token: string, id: string): Promise<any> {
  return fetch(`/orders/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
  })
  .then(data => data.json())
}
