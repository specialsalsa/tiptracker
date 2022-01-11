import React from 'react';
import {Router, Scene} from 'react-native-router-flux';
import Home from './Home';
import TipLog from './TipLog';

const Routes = () => (
  <Router>
    <Scene key="root">
      <Scene key="home" component={Home} title="Home" initial={true} />
      <Scene key="tiplog" component={TipLog} title="Tip Log" />
    </Scene>
  </Router>
);
export default Routes;
