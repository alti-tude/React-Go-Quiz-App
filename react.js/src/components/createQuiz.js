import React, { Component } from 'react';
import EventBus from 'eventing-bus'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class createQuiz extends Component {
  constructor(){
    super();
    this.state = {
      isLogin: false,
      formData: {
          quizname: "",
          genre: ""
      },
      err: "",
    }

    this.handleGChange = this.handleGChange.bind(this)
    this.handleQChange = this.handleQChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleGChange(event){
      this.state.formData.genre = event.target.value
  }

  handleQChange(event){
    this.state.formData.quizname = event.target.value
  }

  handleSubmit(event){
    event.preventDefault();
    let url = "http://localhost:8080/createquiz"
    fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(this.state.formData)
    })
    .then(response => {
        if(response.ok) this.setState({err: "success"})
        else this.setState({err: "error"})
        console.log(this.state)
    })
  }
  componentDidMount(){
    EventBus.publish("login")
  }

  render() {
    return (
    <div>
        <form onSubmit={this.handleSubmit}>
            Quizname <input onChange={this.handleQChange} />
            Genre <input onChange = {this.handleGChange} />
            <input type="submit" value="submit"/> 
        </form>
        {this.state.err}
    </div>
    );
  }
}

export default createQuiz;
