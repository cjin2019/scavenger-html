import React, { Component } from "react";
import { navigate, Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";
import UserHome from "./pages/UserHome.js";
import CreateScavenger from "./pages/CreateScavenger.js";
import PlayGame from "./pages/PlayGame.js";
import NewGame from "./pages/NewGame.js";
import StartGame from "./pages/StartGame.js";
import LandingPage from "./pages/LandingPage";
import Browse from "./pages/Browse.js";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
    };
  }

  getCurrentUser = (callbackFunction) => {
    get("/api/whoami").then((user) => {
      console.log(user);
      if (user._id) {
        
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id });
        console.log(this.state.userId);
      }

      callbackFunction();
    });
  };

  componentDidMount() {
    console.log("App remounted");
    this.getCurrentUser(() => {console.log("hardcoded call back");});
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
      post("/api/initsocket", { socketid: socket.id }).then(() => {
        navigate("/userhome");
      });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout").then(() => {
      navigate("/");
    });
  };

  render() {
    return (
      <>
        <Router>
          {/* <Skeleton
            path="/"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
          /> */}
          <LandingPage
            path="/"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
          />
          <UserHome 
            path = "/userhome"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            getUser = {this.getCurrentUser}
            userId={this.state.userId}
          />
          <Browse 
            path = "/browse"
            handleLogin = {this.handleLogin}
            handleLogout = {this.handleLogout}
            userId = {this.state.userId}
          />
          <CreateScavenger 
            path = "/create"
            userId = {this.state.userId}
            getUser = {this.getCurrentUser}
          />
          <PlayGame 
            path = "/playgame"
            userId = {this.state.userId}
            getUser = {this.getCurrentUser}
          />
          <NewGame 
            path = "/newgame"
            userId = {this.state.userId}
            getUser = {this.getCurrentUser}
          />
          <StartGame 
            path = "/startgame"
            userId = {this.state.userId}
            getUser = {this.getCurrentUser}
          />
          <NotFound default />
        </Router>
      </>
    );
  }
}

export default App;
