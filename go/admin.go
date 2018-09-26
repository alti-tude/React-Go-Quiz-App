package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func GetUsers(w http.ResponseWriter, r *http.Request) {
	var user []User

	if err := db.Where("username != 'admin'").Find(&user).Error; err != nil {
		SendJSONResp(w, http.StatusInternalServerError, err.Error())
		return
	}
	fmt.Println(user)
	SendJSONResp(w, 200, user)
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	var user User
	id := make(map[string]int)

	id["id"] = 0
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &id)
	fmt.Println(id["id"])
	if err := db.Where("id = ?", id["id"]).Delete(&user).Error; err != nil {
		SendJSONResp(w, http.StatusInternalServerError, err.Error())
		return
	}
	fmt.Println("deleted")
	SendJSONResp(w, 200, "deleted")
}
