import React, { Component } from 'react';
import EventBus from 'eventing-bus'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class createQuestion extends Component {
  constructor(){
    super();
    this.state = {
      isLogin: false,
      formData: {
          q_id: -1,
          question: "",
          answer: "",
          op1: "",
          op2: "",
          op3: "",
          op4: ""
      },
      quizList: [],
      err: "",
      temp: ""
    }

    this.handleAChange = this.handleAChange.bind(this)
    this.handleQChange = this.handleQChange.bind(this)
    this.handleo1Change = this.handleo1Change.bind(this)
    this.handleo2Change = this.handleo2Change.bind(this)
    this.handleo3Change = this.handleo3Change.bind(this)
    this.handleo4Change = this.handleo4Change.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getQuiz = this.getQuiz.bind(this)
    this.delete = this.delete.bind(this)
  }

  handleAChange(event, key){
      this.state.quizList[key].answer = event.target.value
      this.setState({temp: event.target.value})
  }

  handleQChange(event, key){
    this.state.quizList[key].question = event.target.value
    this.setState({temp: event.target.value})

  }

  handleo1Change(event, key){
    this.state.quizList[key].op1 = event.target.value
    this.setState({temp: event.target.value})

  }
  handleo2Change(event, key){
    this.state.quizList[key].op2 = event.target.value
    this.setState({temp: event.target.value})

  }
  handleo3Change(event, key){
    this.state.quizList[key].op3 = event.target.value
    this.setState({temp: event.target.value})

  }
  handleo4Change(event, key){
    this.state.quizList[key].op4 = event.target.value
    this.setState({temp: event.target.value})

  }

  handleSubmit(event, key){
    event.preventDefault();
    let url = "http://localhost:8080/createquestion"
    let params = new URLSearchParams(this.props.location.search)
    let qid = params.get('qid')
    this.state.quizList[key].q_id = qid
    fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(this.state.quizList[key])
    })
    .then(response => {
        if(response.ok) {
            this.setState({err: "success", quizList:[]})
            this.getQuiz()
            // window.location.reload()
        }
        else {
          response.json().then(data => this.setState({err: data}))
        }
        console.log(this.state)
    })
  }

  delete(event, index){
    event.preventDefault()
    let url = "http://localhost:8080/deletequestion"
    console.log(this.state.quizList[index])
    fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(this.state.quizList[index])
    })
    .then(response => {
        if(response.ok) {
            this.setState({err: "success"})
            this.getQuiz()
        }
        else response.json().then(data => this.setState({err: data}))
        console.log(this.state)
    })
  }
  getQuiz(){
    this.setState({formData: {
      q_id: -1,
      question: "",
      answer: "",
      op1: "",
      op2: "",
      op3: "",
      op4: ""
    }})
    let url = "http://localhost:8080/getquestions"
    let params = new URLSearchParams(this.props.location.search)
    let qid = parseInt(params.get('qid'))
    fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({qid: qid})
    })
    .then(response => {
        if(response.ok) return response.json()
        else throw new Error("err")
    })
    .then(data => {
        let temp = []
        temp.push(this.state.formData)
        for(let i =0;i<data.length;i++)
            temp.push(data[i])

        this.setState({quizList: temp})
        console.log(this.state.quizList)       
    })
    .catch(err => this.setState({err: err}))
  }

  componentDidMount(){
    EventBus.publish("login")
    this.getQuiz()
  }

  render() {
    return (
    <div>
        {this.state.err}
        {this.state.quizList.map((item, key)=>{
          if(key==0)
            return(
              <form onSubmit={(e) => this.handleSubmit(e, key)}>
                Question <input type = "text" placeholder={item.question} onChange = {(e) => this.handleQChange(e, key)} /> <br></br>
                Option1 <input type = "text" placeholder={item.op1} onChange = {(e) => this.handleo1Change(e, key)} /> <br></br>
                Option2 <input type = "text" placeholder={item.op2} onChange = {(e) => this.handleo2Change(e,key)} /> <br></br>
                Option3 <input type = "text" placeholder={item.op3} onChange = {(e) => this.handleo3Change(e, key)} /> <br></br>
                Option4 <input type = "text" placeholder={item.op4} onChange = {(e) => this.handleo4Change(e, key)} /> <br></br>
                Answer <input type = "integer" placeholder={item.answer} onChange = {(e) => this.handleAChange(e, key)} /> <br></br>
                <input type="submit" value="submit"/> 
              </form>
            )
          else
            return(
              <form onSubmit={(e) => this.handleSubmit(e, key)}>
                Question <input type = "text" placeholder={item.question} onChange = {(e) => this.handleQChange(e, key)} /> <br></br>
                Option1 <input type = "text" placeholder={item.op1} onChange = {(e) => this.handleo1Change(e, key)} /> <br></br>
                Option2 <input type = "text" placeholder={item.op2} onChange = {(e) => this.handleo2Change(e,key)} /> <br></br>
                Option3 <input type = "text" placeholder={item.op3} onChange = {(e) => this.handleo3Change(e, key)} /> <br></br>
                Option4 <input type = "text" placeholder={item.op4} onChange = {(e) => this.handleo4Change(e, key)} /> <br></br>
                Answer <input type = "integer" placeholder={item.answer} onChange = {(e) => this.handleAChange(e, key)} /> <br></br>
                <input type="submit" value="submit"/> 
                <button onClick={(e) => this.delete(e, key)}>Delete</button>
              </form>
            )
        })

        }
        
        
    </div>
    );
  }
}

export default createQuestion;
