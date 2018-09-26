import React, { Component } from 'react';

class signup extends Component {
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
    let url = "http://localhost:8080/signup"
    fetch(url,{
      method: 'POST',
      body: JSON.stringify(this.state.formData)
    })
    .then(response => {
      if(response.ok) this.setState({success: true, failue: false})
      else this.setState({failure: true, success: false, err: response})
      console.log(this.state)  
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

        <input type = "submit" value="submit"/> 
      </form>  
      {/* {this.state} */}

        {this.state.success &&
            <div>
                success
            </div>
        }
        {this.state.failure &&
            <div>
                err: 
            </div>
        }
    </div>
    );
  }
}

export default signup;
