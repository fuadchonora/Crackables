import React from 'react';
import { Route, Switch } from 'react-router-dom';

// FREE
import HomePage from './pages/HomePage';
import CSSNavPage from './pages/CSSNavPage';
import FaPage from './pages/FaPage';
import MasksPage from './pages/MasksPage';


class Routes extends React.Component {
  render() {
    return (
      <Switch>
        
        <Route exact path='/' component={HomePage} />
        <Route exact path='/css' component={CSSNavPage} />

        {/* FREE */}
        <Route path='/css/icons' component={FaPage} />
        <Route path='/css/masks' component={MasksPage} />
        
        <Route
          render={function() {
            return <h1>Not Found</h1>;
          }}
        />
      </Switch>
    );
  }
}

export default Routes;
