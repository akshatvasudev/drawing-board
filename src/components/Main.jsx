import React from 'react';
import Home from './Home'
import DrawingBoard from './DrawingBoard'
import LoginSignup from './LoginSignup'
import { BrowserRouter as Router } from 'react-router-dom'
import { Route, Switch } from 'react-router'
import 'bootstrap/dist/css/bootstrap.min.css';

const Main = (props) => {

    return (
        <Router>
    <main>
      <section className='main'>
        <Switch>
          <Route exact path="/">
              <Home />
          </Route>
          <Route path="/drawing/:id?">
              <DrawingBoard />
          </Route>
          <Route path="/auth/:logout?">
              <LoginSignup />
          </Route>
        </Switch>
      </section>
    </main>
    </Router>
    );
}

export default Main;