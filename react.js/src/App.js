import React, { Component } from 'react';
import './App.css';
import signup from './components/signup.js';
import Login from './components/login.js';
import createQuiz from './components/createQuiz.js';
import DisplayQuiz from './components/displayQuiz.js';
import createQuestion from './components/createQuestion';
import EventBus from 'eventing-bus';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import displayUsers from './components/displayUsers';
import displayQuizzes from './components/displayQuizzes';
import displayQuizzesPlayer from './components/displayQuizzesPlayer';
import displayGenres from './components/displayGenres';
import leaderboard from './components/leaderboard';

class App extends Component {
  constructor(){
    super();
    this.state = {
      isLogin: false,
      username: "",
      uid: -1
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
      if(response.ok) return response.json()
      else throw new Error("err")
    })
    .then(resp => {
        let uid = parseInt(resp["uid"])
        this.setState({
            username: resp["username"],
            uid: uid,
            isLogin: true
        })
      console.log(this.state)

    })
    .catch(err => this.setState({
      username: "",
      isLogin: false
    }))
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
    })
    .then(resp => {
      if(resp.ok) {
        this.setState({
          isLogin: false,
          uid: -1,
          username: ""
        })
      }
    })
  }

  render() {
    return (
    <div>
      {this.state.isLogin &&
        <div>
          <button onClick={this.logout}>logout</button>
          {this.state.username != "admin" &&
            <Router>
              <div>
                <Link to={'/displayQuizzesPlayer'}>view quizzes</Link>&nbsp; &nbsp;
                <Link to={'/leaderboardGenres'}>view leaderboards</Link>

                <Switch>
                  <Route exact path='/createQuiz' component = {createQuiz} />

                  <Route exact path='/displayQuiz' render={routeProps => (
                    <DisplayQuiz {...routeProps} uid = {this.state.uid} />
                  )} />
                  
                  <Route exact path='/displayQuizzesPlayer' component = {displayQuizzesPlayer} />
                  <Route exact path='/leaderboardGenres' component = {displayGenres} />
                  <Route exact path='/leaderboard' component =  {leaderboard} />
                </Switch>
              </div>
            </Router>
          }
          
          {this.state.username == "admin" &&
            <Router>
              <div>
                <Link to={'/createQuiz'}>create quiz</Link> &nbsp;&nbsp;
                <Link to={'/displayUsers'}>view users</Link>&nbsp; &nbsp;
                <Link to={'/displayQuizzes'}>view quizzes</Link>
                <Switch>
                  <Route exact path='/createQuiz' component = {createQuiz} />

                  <Route exact path='/displayQuiz' render={routeProps => (
                    <DisplayQuiz {...routeProps} uid = {this.state.uid} />
                  )} />

                  <Route exact path='/createQuestion' component = {createQuestion} />
                  <Route exact path='/displayUsers' component = {displayUsers} />
                  <Route exact path='/displayQuizzes' component = {displayQuizzes} />
                  
                </Switch>
              </div>
            </Router>
          }
          
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
