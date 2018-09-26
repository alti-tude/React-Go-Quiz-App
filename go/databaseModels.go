package main

//User stores the user details
type User struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

//Quiz stores the quiz name
type Quiz struct {
	ID       uint   `json:"id"`
	Quizname string `json:"quizname"`
	Genre    string `json:"genre"`
}

//Question stores the Question details
type Question struct {
	ID       uint   `json:"id"`
	QID      int    `json:"q_id,string"`
	Question string `json:"question"`
	Op1      string `json:"op1"`
	Op2      string `json:"op2"`
	Op3      string `json:"op3"`
	Op4      string `json:"op4"`
	Answer   int    `json:"answer,string"`
}

type Results struct {
	UID    uint `json:"uid"`
	QuizID uint `json:"quiz_id"`
	Score  uint `json:"score"`
}
