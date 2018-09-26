import React, { Component } from 'react';
import EventBus from 'eventing-bus';

class Login extends Component {
  constructor(){
    super();
    this.state = {
      formData:{
          username: "",
          password: ""
      },
      success: false,
      failure: false,
      err: ""
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handlePassChange = this.handlePassChange.bind(this)
    this.handleUserChange = this.handleUserChange.bind(this)
  }

  handleSubmit(event){
    event.preventDefault();
    let url = "http://localhost:8080/login"
    fetch(url,{
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(this.state.formData)
    })
    .then(response => {
      if(response.ok) {
          EventBus.publish("login")
      }
      else this.setState({failure: true, err: response})
      console.log(this.state.err)
    })
  }

  handlePassChange(event){
    this.setState({
        formData: {
            password: event.target.value,
            username: this.state.formData.username
        }
    })
  }

handleUserChange(event){
  this.setState({
      formData: {
          password: this.state.formData.password,
          username: event.target.value,
      }
  }) 
}    
  render() {
    return (
    <div>
      <form onSubmit = {this.handleSubmit}>
        username: <input type="text" onChange = {this.handleUserChange} />
        password: <input type="text" onChange = {this.handlePassChange} />

        <input type = "submit" value="submit" />
      </form>

      {this.state.failure &&
          <div>
              err: 
          </div>
      }
    </div>
    );
  }
}

export default Login;
