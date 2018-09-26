import React, { Component } from 'react';
import EventBus from 'eventing-bus'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class displayGenres extends Component {
  constructor(){
    super();
    this.state = {
      isLogin: false,
      option: -1,
      err: "",
      quizzes: []
    }
    this.getGenres = this.getGenres.bind(this)
  }

  
  getGenres(){
      let url = "http://localhost:8080/getquizzes"
      fetch(url, {
          method: 'POST',
          credentials: 'include'
      })
      .then(resp => {
        console.log("random")
        if(resp.ok) resp.json().then(data => {
            let ret = data.reduce((acc, val)=>{
                if(acc[acc.length-1]!=val.genre) acc.push(val.genre);
                console.log(val)
                return acc;
            }, [])
            console.log(ret)
            this.setState({quizzes: ret})
        })
        else resp.json().then(data => this.setState({err: data}))
      })
  }
  componentDidMount(){
    EventBus.publish("login")
    this.getGenres()
  }

  render() {
    return (
    <div>
        {this.state.err}
        <h3><Link to={'/leaderboard/?genre='}>Overall</Link></h3>
        <h3>Genres</h3>
        <ul>
            {this.state.quizzes.map((item, key)=> {
                return (
                <li key={key}>
                    <Link to={'/leaderboard/?genre='+item}>{item}</Link>
                </li>
                )
            })}
        </ul>
    </div>
    );
  }
}

export default displayGenres;
