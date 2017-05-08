DROP TABLE users;
DROP TABLE highscores;

CREATE TABLE users (
	username varchar(20) PRIMARY KEY,
	password varchar(20), 
	email varchar(50),
	gamesplayed  integer, 
	lastlogin date
);

CREATE TABLE highscores (
	username varchar(20) PRIMARY KEY,
	highscore integer
);



