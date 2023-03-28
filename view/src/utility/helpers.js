import { useState } from 'react';

export function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
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
    const search = JSON.parse(searchString);
    return search?.search
  };

  const [search, setSearch] = useState(getSearch({
    search: {
      query: '',
      list: []
    }
    
  }));

  const saveSearch = userSearch => {
    sessionStorage.setItem('search', JSON.stringify(userSearch));
    setSearch(userSearch.search);
  };

  return {
    setSearch: saveSearch,
    search
  }
}

export function setCheckoutSession(value) {
  let prevData = JSON.parse(sessionStorage.getItem('checkout'));
  Object.assign(prevData, value)
  sessionStorage.setItem('checkout', JSON.stringify(prevData));
}

export function addToCartLocal(item) {
  let cart = [];
  const currentCart = JSON.parse(localStorage.getItem('cart'))
  if(!currentCart){
    cart[0]=item;
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart
  }
  cart = currentCart || [];
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  return cart;
}

export async function localCartTotal() {
  const cart = JSON.parse(localStorage.getItem('cart'))
  if(!cart) return localStorage.setItem('cart-total', {total: 0});
  let stringPriceArray = [];
  let price;
  let amount;
  let cost;
  for (let item of cart) {
    price = await getProductPrice(item.name);
    price = Number(price).toFixed(2);
    amount = item.amount;
    cost = price*amount;
    stringPriceArray.push(cost);
  }
  const priceArray = stringPriceArray.map(Number);
  const total = priceArray.reduce((x, y) => x+y);
  return total;
}

export async function addLocalCartToDB(token){
  const cart = JSON.parse(localStorage.getItem('cart'));
  if(!cart) return;
  try {
    for (let item of cart) {
    await addToCartDB(item.name, token, item.amount)
    }
  } catch(error) {
    console.log('error')
  }
}

export async function noLoginCheckout(){
  let idArray = [];
  const cart = JSON.parse(localStorage.getItem('cart'));
  if(!cart) return;
  try {
    for (let item of cart) {
      const results = await fetch(`/products/${item.name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({amount: item.amount})
      })
      const json = await results.json();
      idArray.push(json)
      localStorage.setItem('cart-ids', JSON.stringify(idArray))
    }
  } catch(error) {
    console.log('error')
  }
}

export function useAuth() {
  const token = sessionStorage.getItem("token");
  if(token){
    return true;
  }
}

export async function createUser(credentials) {
  return fetch('/register' , {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json());
}

export async function updateDetails(token, credentials) {
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

export async function updatePassword(token, credentials) {
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

export async function loginUser(credentials) {
  return fetch('/login' , {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json())
}

export async function getUser(token) {
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

export async function getProductsOfCategory(category) {
  return fetch(`/products/c/${category}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(data => data.json())
}

export async function getProduct(product) {
  return fetch(`/products/${product}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
  .then(data => data.json())
}

export async function getProductPrice(product) {
  return fetch(`/products/${product}/price`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(data => data.json())
}

export async function getAllProducts() {
  return fetch('/products', {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(data => data.json())
}

export async function updateProducts(credentials, token) {
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

export async function addToCartDB(product, token, amount) {
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

export async function getCart(token) {
  return fetch('/cart', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    }
  })
  .then(data => data.json())
}

export async function getCartTotal(token) {
  return fetch('/cart/total', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    }
  })
  .then(data => data.json())
}

export async function updateCart(id, amount) {
  return fetch(`/cart/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({amount: amount})
  })
  .then(data => data.json())
}

export async function deleteFromCartDB(id) {
  return fetch(`/cart/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(data => data.status)
}

export async function deleteCart(credentials, token) {
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

export async function createOrder(credentials, token) {
  return fetch('/checkout' , {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json());
}
