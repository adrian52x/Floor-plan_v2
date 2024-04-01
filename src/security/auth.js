import { writable } from 'svelte/store';
import { baseURL } from '../store/store';
import toast from 'svelte-french-toast';

export const user = writable(null);

// export function isAuthenticatedTokenExists() {
//     return getCookie('jwt_auth');
// }

// export function setAuthenticatedUser(userData) {
//     user.set(userData);
// }

// export function parseToken(token) {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(
//         atob(base64)
//             .split('')
//             .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//             .join('')
//     );

//   return JSON.parse(jsonPayload);
// }

// function getCookie(name) {
//     if (typeof document === 'undefined') {
//         return null;
//       }
    
//       const value = `; ${document.cookie}`;
//       const parts = value.split(`; ${name}=`);
      
//       if (parts.length === 2) {
//         return parts.pop().split(';').shift();
//       }
    
//       return null;
// }

export function isAuthenticatedTokenExists() {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('jwt_auth');
  }
  return null;
}

export function setAuthenticatedUser(userData) {
  user.set(userData);
}

export function parseToken(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}



// Login
export async function handleLogin(userName, password) {
    const response = await fetch(`${baseURL}/api/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          userName: userName.toLowerCase(),
          password: password
      })
    });

    // Handle the response from the server
    if (response.ok) {
      // Successful login, redirect or perform further actions
      toast.success('Login successful!');
      const token = await response.json();
      localStorage.setItem('jwt_auth', token);
      
      // Redirect to the main page
      setTimeout(() => {
          location.replace("/");
      }, 700)

    } else {
      // Error occurred during login
      response.json().then(data => toast.error(`${data.error}`));
    }
}

// Logout with JWT-cookie
// export const handleLogout = async () => {
//     await fetch(`${baseURL}/api/logout`, {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         credentials: 'include',
//     });
//     location.replace("/");

// }

// Logout with JWT-localStorage
export const handleLogout =  () => {
  localStorage.removeItem('jwt_auth');
  location.replace("/");
}