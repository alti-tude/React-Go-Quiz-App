package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func CreateQuiz(w http.ResponseWriter, r *http.Request) {
	var quiz Quiz

	body, _ := ioutil.ReadAll(r.Body)
	if err := json.Unmarshal(body, &quiz); err != nil {
		SendJSONResp(w, http.StatusInternalServerError, err.Error())
		return
	}
	fmt.Println(quiz)

	u := &quiz
	if u.Quizname == "" {
		SendJSONResp(w, http.StatusNotFound, "enter a quizname")
		return
	}
	fmt.Println(quiz)

	if err := db.Save(&quiz).Error; err != nil {
		SendJSONResp(w, http.StatusInternalServerError, err.Error())
		return
	}
	fmt.Println(quiz)
}

func CreateQuestion(w http.ResponseWriter, r *http.Request) {
	var question Question

	body, _ := ioutil.ReadAll(r.Body)
	if err := json.Unmarshal(body, &question); err != nil {
		SendJSONResp(w, http.StatusInternalServerError, err.Error())
		return
	}
	fmt.Println(question)

	if err := db.Save(&question).Error; err != nil {
		SendJSONResp(w, http.StatusInternalServerError, err.Error())
		return
	}
	fmt.Println(question)
}

func GetQuestions(w http.ResponseWriter, r *http.Request) {
	var question []Question
	id := make(map[string]int)
	id["qid"] = 0

	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &id)
	if err := db.Where("q_id = ?", id["qid"]).Find(&question).Error; err != nil {
		SendJSONResp(w, http.StatusInternalServerError, err.Error())
		return
	}
	SendJSONResp(w, 200, question)
}

func GetQuizzes(w http.ResponseWriter, r *http.Request) {
	var quiz []Quiz
	if err := db.Find(&quiz).Error; err != nil {
		SendJSONResp(w, http.StatusInternalServerError, err.Error())
		return
	}
	fmt.Println(quiz)
	SendJSONResp(w, 200, quiz)
}

func SubmitQuiz(w http.ResponseWriter, r *http.Request) {
	var result Results

	body, _ := ioutil.ReadAll(r.Body)

	if err := json.Unmarshal(body, &result); err != nil {
		SendJSONResp(w, http.StatusInternalServerError, err.Error())
		return
	}

	if err := db.Save(&result).Error; err != nil {
		SendJSONResp(w, http.StatusConflict, err.Error())
		return
	}

	fmt.Println(result)
	SendJSONResp(w, 200, "success")
}

type Ret struct {
	Tot      int64  `json:"tot"`
	Username string `json:"username"`
}

type Params struct {
	Genre string `json:"genre"`
}

func GetResults(w http.ResponseWriter, r *http.Request) {
	var ret []Ret
	var param Params
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &param)
	fmt.Println(param)
	genre := param.Genre
	if genre == "" {
		if err := db.Select("SUM(results.score) as tot, users.username as username").Table("results").Joins("JOIN users on users.id = results.uid").Joins("JOIN quizzes on results.quiz_id = quizzes.id").Group("users.username").Find(&ret).Error; err != nil {
			SendJSONResp(w, http.StatusInternalServerError, err.Error())
			return
		}
	}
	if genre != "" {
		if err := db.Select("SUM(results.score) as tot, users.username as username").Table("results").Joins("JOIN users on users.id = results.uid").Joins("JOIN quizzes on results.quiz_id = quizzes.id").Where("quizzes.genre=?", genre).Group("users.username").Find(&ret).Error; err != nil {
			SendJSONResp(w, http.StatusInternalServerError, err.Error())
			return
		}
	}
	// data := db.Table("results").Joins("JOIN users on users.id = results.uid")
	SendJSONResp(w, 200, ret)
}

func DeleteQuestion(w http.ResponseWriter, r *http.Request) {
	var question Question

	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &question)
	fmt.Println(question.ID)
	// fmt.Println(question)

	if err := db.Where("id = ?", question.ID).Delete(&question).Error; err != nil {
		SendJSONResp(w, http.StatusInternalServerError, err.Error())
		return
	}
	fmt.Println("deleted")
	SendJSONResp(w, 200, "deleted")
}

func DeleteQuiz(w http.ResponseWriter, r *http.Request) {
	var quiz Quiz
	id := make(map[string]int)

	id["qid"] = 0
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &id)
	fmt.Println(id["qid"])
	if err := db.Where("id = ?", id["qid"]).Delete(&quiz).Error; err != nil {
		SendJSONResp(w, http.StatusInternalServerError, err.Error())
		return
	}
	fmt.Println("deleted")
	SendJSONResp(w, 200, "deleted")
}
