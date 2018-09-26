import React, { Component } from 'react';
import EventBus from 'eventing-bus'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class displayUsers extends Component {
  constructor(){
    super();
    this.state = {
      isLogin: false,
      option: -1,
      err: "",
      users: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getUsers = this.getUsers.bind(this)
  }

  handleChange(changEvent){
    this.state.option = changEvent.target.value;
    console.log("selected -> "+this.state.option);

  }

  handleSubmit(event){
    event.preventDefault();
    let url = "http://localhost:8080/deleteuser"
    let resp = parseInt(this.state.option)
    fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({id: resp})
    })
    .then(response => {
        if(response.ok) {
            this.setState({err: "success"})
            this.getUsers()
        }
        else response.json().then(data => this.setState({err: data}))
        console.log(this.state)
    })
  }

  getUsers(){
      let url = "http://localhost:8080/getusers"
      fetch(url, {
          method: 'POST',
          credentials: 'include'
      })
      .then(resp => {
        if(resp.ok) resp.json().then(data => this.setState({users: data}))
        else resp.json().then(data => this.setState({err: data}))
      })
  }
  componentDidMount(){
    EventBus.publish("login")
    this.getUsers()
  }

  render() {
    return (
    <div>
        <form onSubmit={this.handleSubmit}>
            {this.state.users.map((item, key)=> {
                return (
                <div key={key}>
                    {item.username}: <input value={item.id} type="radio" onChange={this.handleChange} name="radiosAnnoying"></input> 
                </div>
                )
            })}
            <input type="submit" value="submit" />
        </form>
        {this.state.err}
    </div>
    );
  }
}

export default displayUsers;
