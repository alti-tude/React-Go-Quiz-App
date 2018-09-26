create table if not exists users(
	"id" integer Primary Key autoincrement not null, 
	username string unique not null,
	password string not null
);

CREATE TABLE IF NOT EXISTS "quizzes" (
	"id" integer primary key autoincrement,
	"quizname" varchar(255) not null,
	"genre" varchar(255),
		UNIQUE(quizname, genre)
);

CREATE TABLE IF NOT EXISTS "questions" (
	"id" integer primary key autoincrement,
	"q_id" integer,
	"question" varchar(255) not null,
	"op1" varchar(255) not null,
	"op2" varchar(255) not null,
	"op3" varchar(255) not null,
	"op4" varchar(255) not null,
	"answer" integer not null,
		FOREIGN KEY(q_id) REFERENCES quizzes(id) ON DELETE CASCADE,
		UNIQUE(question, q_id)
);

CREATE TABLE IF NOT EXISTS "results" (
	"uid" integer not null,
	"quiz_id" integer not null,
	"score" integer not null,
		FOREIGN KEY(uid) REFERENCES users(id) ON DELETE CASCADE,
		FOREIGN KEY(quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
		PRIMARY KEY(uid, quiz_id)
);