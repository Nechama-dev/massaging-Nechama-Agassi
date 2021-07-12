import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './componnent/login/Login'
import { Provider } from 'react-redux';
import store from './redux/store';
import CreateGroup from './componnent/groups/Create_room';
import Home from './componnent/chat/Home/Home.jsx';
import ChatRoom from './componnent/chat/ChatRoom/ChatRoom.jsx';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";


function App() {
  return (
    <Provider store={store}>
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/CreateGroup" component={CreateGroup} />
            {/* <Route exact path="/SelectGroup" component={SelectGroup} /> */}
            <Route exact path="/Home" component={Home} />
            <Route exact path="/:roomId" component={ChatRoom} />
          </Switch>
        </Router>
      </div>
    </Provider>
  )

}

export default App



