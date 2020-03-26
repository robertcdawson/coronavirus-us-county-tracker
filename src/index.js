import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const pageTitle = 'Coronavirus US County Tracker';

ReactDOM.render(
  <div className="App">
    <Helmet>
      <meta charSet="utf-8" />
      <title>{pageTitle}</title>
      <link
        rel="canonical"
        href="https://coronavirus-us-county-tracker.netlify.com/"
      />
      <meta
        name="description"
        content="Search coronavirus disease (COVID-19) data by US county"
      />
    </Helmet>
    <React.StrictMode>
      <App pageTitle={pageTitle} />
    </React.StrictMode>
  </div>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
