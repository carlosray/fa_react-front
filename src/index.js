import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import RestService from "./service/RestService";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import IndexComponent from "./IndexComponent";

RestService.setupAxiosInterceptors();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<IndexComponent/>);
