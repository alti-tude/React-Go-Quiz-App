package main

import (
	"net/http"
	"strconv"
)

func GetUser(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "session")
	if session.Values["username"] == nil || session.Values["admin"] == nil {
		SendJSONResp(w, 404, "logout")
		return
	}
	username := session.Values["username"].(string)
	admin := session.Values["admin"].(string)

	var user User
	db.Where("username = ?", username).First(&user)

	id := user.ID
	m := make(map[string]string)

	m["username"] = username
	m["admin"] = admin
	m["uid"] = strconv.Itoa(int(id))
	SendJSONResp(w, 200, m)
}
