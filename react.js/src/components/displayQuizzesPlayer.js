import React, { Component } from 'react';
import EventBus from 'eventing-bus'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class displayQuizzesPlayer extends Component {
  constructor(){
    super();
    this.state = {
      isLogin: false,
      err: "",
      quizzes: []
    }
    this.getQuizzes = this.getQuizzes.bind(this)
  }

  getQuizzes(){
      let url = "http://localhost:8080/getquizzes"
      fetch(url, {
          method: 'POST',
          credentials: 'include'
      })
      .then(resp => {
        if(resp.ok) resp.json().then(data => {
            data.sort( (a,b) =>{
                var nameA=a.genre.toLowerCase(), nameB=b.genre.toLowerCase()
                if (nameA < nameB) //sort string ascending
                    return -1 
                if (nameA > nameB)
                    return 1
                return 0 
            })
            this.setState({quizzes: data})
            console.log(data)
        })
        else resp.json().then(data => this.setState({err: data}))
      })
  }
  componentDidMount(){
    EventBus.publish("login")
    this.getQuizzes()
  }

  render() {
    var cur = ""
    return (
    <div>
        <ul>
            {this.state.quizzes.map((item, key)=> {
                if(item.genre==cur)
                    return (
                        <ul>
                            <li key={key}>
                                <Link to={'/displayQuiz/?qid='+item.id+'&quizname='+item.quizname}>disp{item.quizname}</Link>
                            </li>
                        </ul>
                    )
                else{
                    cur = item.genre
                    return (
                        <li>{cur}
                            <ul>
                                <li>
                                    <Link to={'/displayQuiz/?qid='+item.id+'&quizname='+item.quizname}>disp{item.quizname}</Link>
                                </li>
                            </ul>
                        </li>
                    )
                }
            })}
        </ul>
        {this.state.err}
    </div>
    );
  }
}

export default displayQuizzesPlayer;
