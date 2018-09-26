import React, { Component } from 'react';
import EventBus from 'eventing-bus'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class leaderboard extends Component {
  constructor(){
    super();
    this.state = {
      isLogin: false,
      option: -1,
      err: "",
      scores: []
    }
    this.getGenres = this.getGenres.bind(this)
  }

  
  getGenres(){
      let url = "http://localhost:8080/getresults"
      let params = new URLSearchParams(this.props.location.search)
      let genre = params.get('genre')
      fetch(url, {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({genre: genre})
      })
      .then(resp => {
        if(resp.ok) resp.json().then(data => {
            let ret = data.filter((val)=>{
                if(val.username=="admin") return false
                else return true
            })
            ret.sort((a,b) => {
                if(a.tot>b.tot) return -1
                else if(a.tot<b.tot) return 1
                return 0
            })
            console.log(ret)
            this.setState({scores: ret})
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
        <table border="solid">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Score</th>
                </tr>
                
            </thead>
            <tbody>
                {this.state.scores.map((item, key)=> {
                    return (
                        <tr>
                            <td>{item.username}</td>
                            <td>{item.tot}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
    );
  }
}

export default leaderboard;
