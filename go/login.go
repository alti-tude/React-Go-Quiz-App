package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
)

var store = sessions.NewCookieStore(securecookie.GenerateRandomKey(64), securecookie.GenerateRandomKey(32))

//SignUpHandler handles the signup process
func SignUpHandler(w http.ResponseWriter, r *http.Request) {
	var user User

	body, _ := ioutil.ReadAll(r.Body)
	if err := json.Unmarshal(body, &user); err != nil {
		SendJSONResp(w, http.StatusInternalServerError, err.Error())
		return
	}
	fmt.Println(user)

	u := &user
	if u.Username == "" || u.Password == "" {
		SendJSONResp(w, http.StatusInternalServerError, "missing username or password")
		return
	}
	fmt.Println(user)

	if err := db.Save(&user).Error; err != nil {
		SendJSONResp(w, http.StatusInternalServerError, err.Error())
		return
	}
	fmt.Println(user)

	SendJSONResp(w, 200, "success")
}

//LoginHandler handles cookies
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	body, _ := ioutil.ReadAll(r.Body)
	if err := json.Unmarshal(body, &user); err != nil {
		SendJSONResp(w, http.StatusInternalServerError, err.Error())
		return
	}
	fmt.Println(user)

	var op User

	if err := db.Where("username = ? and password = ?", user.Username, user.Password).Find(&op).Error; err != nil {
		SendJSONResp(w, http.StatusNotFound, err.Error())
		return
	}
	fmt.Println(op)

	setSessionCookie(w, r, &op)
	SendJSONResp(w, 200, "loggedin")
}

//LogoutHandler handles Logout
func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("deltein")

	deleteSessionCookie(w, r)
	fmt.Println("delteed")

	SendJSONResp(w, 200, "loggedout")
}

func setSessionCookie(w http.ResponseWriter, r *http.Request, user *User) {
	session, _ := store.Get(r, "session")
	session.Values["username"] = user.Username
	session.Values["admin"] = "false"
	if user.Username == "admin" {
		session.Values["admin"] = "true"
	}
	session.Save(r, w)
}

func deleteSessionCookie(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "session")
	session.Options = &sessions.Options{
		MaxAge:   -1,
		HttpOnly: true,
	}
	session.Save(r, w)
}
