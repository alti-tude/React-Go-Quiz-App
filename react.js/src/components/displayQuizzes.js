import React, { Component } from 'react';
import EventBus from 'eventing-bus'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class displayQuizzes extends Component {
  constructor(){
    super();
    this.state = {
      isLogin: false,
      err: "",
      quizzes: []
    }
    this.getQuizzes = this.getQuizzes.bind(this)
  }

  delete(event, id){
    event.preventDefault();
    let url = "http://localhost:8080/deletequiz"
    let resp = parseInt(id)
    fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({qid: resp})
    })
    .then(response => {
        if(response.ok) {
            this.setState({err: "success"})
            this.getQuizzes()
        }
        else response.json().then(data => this.setState({err: data}))
        console.log(this.state)
    })
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
                                <Link to={'/createQuestion/?qid='+item.id+'&quizname'+item.quizname}>{item.quizname}</Link>
                                <button onClick = {(e) => this.delete(e, item.id)}>Delete</button>
                            </li>
                        </ul>
                    )
                else{
                    cur = item.genre
                    return (
                        <li>{cur}
                            <ul>
                                <li>
                                    <Link to={'/createQuestion/?qid='+item.id+'&quizname'+item.quizname}>{item.quizname}</Link>
                                  <button onClick = {(e) => this.delete(e, item.id)}>Delete</button>
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

export default displayQuizzes;
