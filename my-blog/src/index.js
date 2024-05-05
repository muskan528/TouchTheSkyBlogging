import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCk1bqg0rLMyZId7tHl7pa5vD-hc7ObjhI",
  authDomain: "my-react-blog-1b0a2.firebaseapp.com",
  projectId: "my-react-blog-1b0a2",
  storageBucket: "my-react-blog-1b0a2.appspot.com",
  messagingSenderId: "215398061825",
  appId: "1:215398061825:web:5b1d074bd9e650df93ed00"
};

const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
