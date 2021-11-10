import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import './index.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GlobalProvider } from './context/GlobalState'

ReactDOM.render(
  <GlobalProvider>
    <App />
  </GlobalProvider>
  
  ,
  document.getElementById('root')
);

