package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"github.com/rs/cors"
)

var db *gorm.DB
var err error

func main() {
	db, err = gorm.Open("sqlite3", "database.db")
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()
	db.AutoMigrate(&User{})
	db.AutoMigrate(&Quiz{})
	db.AutoMigrate(&Question{})
	db.Exec("PRAGMA foreign_keys = ON")

	router := mux.NewRouter()
	router.HandleFunc("/signup", SignUpHandler)
	router.HandleFunc("/login", LoginHandler)
	router.HandleFunc("/logout", LogoutHandler)
	router.HandleFunc("/getuser", GetUser)

	router.HandleFunc("/createquiz", CreateQuiz)
	router.HandleFunc("/createquestion", CreateQuestion)
	router.HandleFunc("/getquestions", GetQuestions)
	router.HandleFunc("/getresults", GetResults)
	router.HandleFunc("/submitquiz", SubmitQuiz)
	router.HandleFunc("/getquizzes", GetQuizzes)
	router.HandleFunc("/deletequiz", DeleteQuiz)
	router.HandleFunc("/deletequestion", DeleteQuestion)

	router.HandleFunc("/getusers", GetUsers)
	router.HandleFunc("/deleteuser", DeleteUser)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
	})
	handler := c.Handler(router)
	http.ListenAndServe("localhost:8080", handler)
}

//SendJSONResp sends the requisite responose
func SendJSONResp(w http.ResponseWriter, status int, payload interface{}) {
	resp, err := json.Marshal(payload)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("access-control-allow-origin", "http://localhost:3000")
	w.Header().Set("access-control-allow-credentials", "true")
	w.WriteHeader(status)
	w.Write([]byte(resp))
}
