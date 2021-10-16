import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import Games from "../components/Games";
import Game from "../components/Game";

export default () => (
  <Router>
    <Switch>
      <Route path="/games/:id">
        <Game />
      </Route>
      <Route path="/games">
        <Games />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </Router>
);
