import React from 'react';
import Router from 'react-router';
const { HashLocation } = Router;

// Initializes all routes
import routes from './routes';

console.log('Initializing in ' + NODE_ENV + ' mode.');

// Configure React Router to use hash locations to determine the current
// route. (e.g. http://example.com#/home).
let location = HashLocation;

import elasticClientActions from './actions/ElasticClientActions'
elasticClientActions.loadListFromJson()

Router.run(routes, location, function(Handler) {
  return React.render(<Handler />, document.body);
});


