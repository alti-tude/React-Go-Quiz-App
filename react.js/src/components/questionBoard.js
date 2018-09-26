import React, { Component } from 'react';
import './App.css';
import signup from './components/signup.js';
import Login from './components/login.js';
import EventBus from 'eventing-bus';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class App extends Component {
  constructor(){
    super();
    this.state = {
      isLogin: false,
      username: "",
    }
    this.loginCheck = this.loginCheck.bind(this)
    this.logout = this.logout.bind(this)
  }

  loginCheck(){
    let url = "http://localhost:8080/getuser"
    fetch(url,{
      method: 'POST',
      credentials: 'include'
    })
    .then(response => {
      if(response.ok) this.setState({isLogin: true})
      else this.setState({isLogin: false})
    })
    console.log(this.state)
  }

  componentDidMount(){
    EventBus.on("login", this.loginCheck);
    this.loginCheck();
  }

  logout(){
    let url = "http://localhost:8080/logout"
    fetch(url,{
      method: 'POST',
      credentials: 'include'
    }).then(resp => {
      if(resp.ok) {
        this.setState({isLogin: false})
      }
    })
  }

  render() {
    return (
    <div>
      {this.state.isLogin &&
        <div>
          <button onClick={this.logout}>logout</button>
        </div>      
      }
      {!this.state.isLogin &&
        <div>
          <Router>
            <div>
              <Link to={'/signup'}>Signup</Link>
              <Link to={'/login'}>Login</Link>

              <Switch>
                <Route exact path='/signup' component = {signup} />
                <Route exact path='/login' component = {Login} loginCheck = {this.loginCheck} />
              </Switch>
            </div>
          </Router>
          
        </div>
      }
    </div>
    );
  }
}

export default App;
