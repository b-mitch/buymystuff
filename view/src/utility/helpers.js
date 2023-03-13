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
    console.log(userToken)
    setToken(userToken);
  };

  return {
    setToken: saveToken,
    token
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
  const jwt = token.token
  return fetch('/account/details' , {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": jwt
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json());
}

export async function updatePassword(token, credentials) {
  const jwt = token.token
  return fetch('/account/password' , {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": jwt
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

export async function getUser (token) {
  const jwt = token.token
  return fetch('/account', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": jwt
    }
  })
  .then(data => data.json())
}