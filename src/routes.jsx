import React from 'react';
import { Route, DefaultRoute, Redirect } from 'react-router';

// You must import all of the components that represent route handlers
import App from './routes/App';
import Home from './routes/Home';
import StaticPage from './routes/StaticPage';
import ClientConfig from './routes/ClientConfig';
import Query from './routes/Query';

export default (
  <Route path="/" handler={App}>
    <DefaultRoute name="home" handler={Home}/>
    <Redirect from="query" to="/query/raw" />
    <Route name="query" handler={Query} >
      <Route name="/query/:resultTab" handler={Query}/>
      <DefaultRoute name="raw" handler={Query}/>
    </Route>
    <Route name="config" handler={ClientConfig}/>
    <Route name="static" path="static/:name" handler={StaticPage}/>
  </Route>
);
