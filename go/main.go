package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/securecookie"
)

const indexPage = "hi"

var loggedIn = false

var cookieHandler = securecookie.New(
	securecookie.GenerateRandomKey(64),
	securecookie.GenerateRandomKey(32))

func getUsername(request *http.Request) (userName string) {
	userName = ""
	if cookie, err := request.Cookie("session"); err == nil {
		cookieDecoded := make(map[string]string)
		if err = cookieHandler.Decode("session", cookie.Value, &cookieDecoded); err == nil {
			userName = cookieDecoded["name"]
		}
	}
	return userName
}

func setSessionCookie(userName string, response http.ResponseWriter) {
	value := map[string]string{
		"name": userName,
	}

	if cookieEncoded, err := cookieHandler.Encode("session", value); err == nil {
		cookie := http.Cookie{
			Name:  "session",
			Value: cookieEncoded,
			Path:  "/",
		}
		http.SetCookie(response, &cookie)
		loggedIn = true
	}
}

func deleteSessionCookie(response http.ResponseWriter) {
	cookie := http.Cookie{
		Name:   "session",
		Value:  "",
		Path:   "",
		MaxAge: -1,
	}
	http.SetCookie(response, &cookie)
	loggedIn = false
}
func index(response http.ResponseWriter, request *http.Request) {
	if loggedIn == true {
		http.Redirect(response, request, "/internal", 302)
	}
	fmt.Fprintf(response, indexPage)
	fmt.Printf("index\n")
}

func login(response http.ResponseWriter, request *http.Request) {
	username := request.FormValue("uName")
	password := request.FormValue("pwd")

	nextPage := "/"
	if username != "" && password != "" {
		//successfull login
		setSessionCookie(username, response)
		fmt.Printf("logged_in_success")
		nextPage = "/internal"
	}

	http.Redirect(response, request, nextPage, 302)
}

func internal(response http.ResponseWriter, request *http.Request) {
	if loggedIn == false {
		http.Redirect(response, request, "/", 302)
	}
	internalPage := getUsername(request)
	fmt.Fprint(response, internalPage)
}

func logout(response http.ResponseWriter, request *http.Request) {
	deleteSessionCookie(response)
	http.Redirect(response, request, "/", 302)
}
func main() {
	router := mux.NewRouter()

	router.HandleFunc("/", index)
	router.HandleFunc("/login", login).Methods("GET")
	router.HandleFunc("/internal", internal)
	router.HandleFunc("/logout", logout)
	http.Handle("/", router)
	http.ListenAndServe(":8080", nil)
}
