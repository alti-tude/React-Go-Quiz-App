import React, { Component } from 'react';
import EventBus from 'eventing-bus'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class DisplayQuiz extends Component {
  constructor(){
    super();
    this.state = {
      isLogin: false,
      err: "",

      answerList: [],
      quizList: [],
      score: 0,
      
      quizname: "",
      showAnswers: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  getQuiz(){
    let url = "http://localhost:8080/getquestions"
    let params = new URLSearchParams(this.props.location.search)
    let qid = parseInt(params.get('qid'))
    this.state.quizname = params.get('quizname')
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
        this.setState({quizList: data})
        console.log(this.state.quizList)
        for(let i =0;i<this.state.quizList.length;i++)
            this.state.answerList.push(-1)
        
    })
    .catch(err => this.setState({err: err}))
  }

  handleChange(event, key, val){
      this.state.answerList[key] = val
      console.log(this.state.answerList)
  }

  handleSubmit(event){
    event.preventDefault();
    for(let i = 0; i<this.state.quizList.length; i++){
        if(this.state.quizList[i].answer==this.state.answerList[i]) this.state.score +=1;
    }
    console.log(this.props.uid)
    let params = new URLSearchParams(this.props.location.search)
    let qid = parseInt(params.get('qid'))
    let resp = {
        quiz_id: qid,
        uid: this.props.uid,
        score: this.state.score
    }
    console.log(resp)
    let url = "http://localhost:8080/submitquiz"

    fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(resp)
    })
    .then(resp => {
        if(resp.ok) this.setState({showAnswers: true, err: ""})
        else this.setState({showAnswers: false, err: "someting went wrong :("})
    })
  }

  componentDidMount(){
    EventBus.publish("login")
    this.getQuiz()
    
  }

  render() {
    return (
    <div>
        <h1> {this.state.quizname}</h1>
        score = {this.state.score} <br></br>
        <form onSubmit = {this.handleSubmit}>
            {this.state.quizList.map((item,key) => {
                return(
                    <div key={key}> 
                        <p> {key} </p>
                        <p> {item.question} </p>
                            <input type="radio" value = {item.op1} name ={key} onChange= {(e) => this.handleChange(e, key, 1)}/>
                                <label>{item.op1}</label> 
                                {item.answer == 1 && this.state.showAnswers &&
                                    <div> Correct answer </div>
                                }
                                {this.state.answerList[key] === 1 &&
                                    <div> Your answer </div>
                                }
                                <br></br>
                            <input type="radio" value = {item.op2} name ={key} onChange= {(e) => this.handleChange(e, key, 2)}/>
                                <label>{item.op2}</label>
                                {item.answer == 2 && this.state.showAnswers &&
                                    <div> Correct answer </div>
                                }
                                {this.state.answerList[key] === 2 &&
                                    <div> Your answer </div>
                                }
                                <br></br>
                            <input type="radio" value = {item.op3} name ={key} onChange= {(e) => this.handleChange(e, key, 3)}/>
                                <label>{item.op3}</label>   
                                {item.answer == 3 && this.state.showAnswers &&
                                    <div> Correct answer </div>
                                }
                                {this.state.answerList[key] === 3 &&
                                    <div> Your answer </div>
                                }
                                <br></br>
                            <input type="radio" value = {item.op4} name ={key} onChange= {(e) => this.handleChange(e, key, 4)}/>
                                <label>{item.op4}</label>
                                {item.answer == 4 && this.state.showAnswers &&
                                    <div> Correct answer </div>
                                }
                                {this.state.answerList[key] === 4 &&
                                    <div> Your answer </div>
                                }
                                <br></br>
                        <hr></hr>
                    </div>
                )
            })}
            <input type = "submit" value = "submit" />
        </form>
        {this.state.err}
    </div>
    );
  }
}

export default DisplayQuiz;
