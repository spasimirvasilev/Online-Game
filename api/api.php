<?php
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
//$input = file_get_contents('php://input'); // for stuff coming from stdin
//$input = json_decode(file_get_contents('php://input'),true); // for stuff coming from stdin
parse_str(file_get_contents('php://input'), $input); // for stuff coming in from stdin

$reply = array();

switch ($method) {
  case 'GET':
  	$id = $_REQUEST['username'];
  	$password = $_REQUEST['password'];
	$scores = $_REQUEST['scores'];

	if ($scores != null){
		$insert_sells_query="select * from highscores order by highscore DESC limit 10;";
   		$result = pg_prepare($dbconn, "my_query1", $insert_sells_query);
		$result = pg_execute($dbconn, "my_query1", array());
		$row =  pg_fetch_all($result);
		$reply["scoresarray"] = $row;
	}
	else if ($id != null){
		
		if ($password != null || $password != ""){
			$insert_sells_query="select * from users where username=$1 and password=$2;";
	    	$result = pg_prepare($dbconn, "my_query9", $insert_sells_query);
			$result = pg_execute($dbconn, "my_query9", array($id,$password));
			$row = pg_fetch_row($result);
	  		$reply["username"] = $row[0];
	  		$reply["email"] = $row[2];
	  		$reply["numGamesPlayed"] = $row[3];
	  		$reply["lastLogin"] = $row[4];
			if($row[1] == $password){
				$reply["valid"] = true;
	  		}
	  		else $reply["valid"] = false;
	  	}
	  	else{
	  		$insert_sells_query="select * from users where username=$1;";
	    	$result = pg_prepare($dbconn, "my_query9", $insert_sells_query);
			$result = pg_execute($dbconn, "my_query9", array($id));
			$row = pg_fetch_row($result);
	  		if($row[1] == $password){
	  			$reply["username"] = $row[0];
				$reply["valid"] = true;
	  		}
	  		else $reply["valid"] = false;
  		}
	}
	header($_SERVER["SERVER_PROTOCOL"]." 200");
	break;
  case 'PUT': # new item
	$id = $input["username"];
	$value = $input["password"];
	$email = $input["email"];
	$insert_sells_query="insert into users (username, password, email, gamesplayed, lastlogin) values($1,$2,$3,$4,current_date);";
    $result = pg_prepare($dbconn, "my_query0", $insert_sells_query);
	$result = pg_execute($dbconn, "my_query0", array($id, $value, $email, 0));
	$insert_sells_query="insert into highscores (username,highscore) values($1,$2);";
    $result = pg_prepare($dbconn, "my_query5", $insert_sells_query);
	$result = pg_execute($dbconn, "my_query5", array($id,0));
	header($_SERVER["SERVER_PROTOCOL"]." 200");
	break;
  case 'POST': # update to existing item
  	$id = $input["username"];
	$value = $input["password"];
	$email = $input["email"];
	$changedate = $input["changedate"];
	$updatetimes = $input["updatetimes"];
	$score = $input["score"];
	$oldpass = $input["oldpassword"];

	if ($changedate == true){
		$insert_sells_query="update users set lastlogin=current_date where username=$1 and password=$2;";
    	$result = pg_prepare($dbconn, "my_query6", $insert_sells_query);
		$result = pg_execute($dbconn, "my_query6", array($id,$value));

	}
	else if ($updatetimes == true){
		$insert_sells_query="update users set gamesplayed=gamesplayed+1 where username=$1 and password=$2;";
    	$result = pg_prepare($dbconn, "my_query7", $insert_sells_query);
		$result = pg_execute($dbconn, "my_query7", array($id,$value));
	}
	if ($score != null){
		$insert_sells_query="update highscores set highscore=$1 where username=$2 and highscore<$1;";
    	$result = pg_prepare($dbconn, "my_query7", $insert_sells_query);
		$result = pg_execute($dbconn, "my_query7", array($score,$id));
	}
	else{
		if ($value != "" && $email != ""){
		$insert_sells_query="update users set password=$1,email=$2 where username=$3 and password=$4;";
    	$result = pg_prepare($dbconn, "my_query2", $insert_sells_query);
		$result = pg_execute($dbconn, "my_query2", array($value, $email, $id, $oldpass));
		}
		else if ($value != ""){
			$insert_sells_query="update users set password=$1 where username=$2 and password=$3;";
	    	$result = pg_prepare($dbconn, "my_query3", $insert_sells_query);
			$result = pg_execute($dbconn, "my_query3", array($value, $id, $oldpass));
		}
		else if ($email != ""){
			$insert_sells_query="update users set email=$1 where username=$2 and password=$3;";
	    	$result = pg_prepare($dbconn, "my_query4", $insert_sells_query);
			$result = pg_execute($dbconn, "my_query4", array($email, $id, $oldpass));
		}
	}
	header($_SERVER["SERVER_PROTOCOL"]." 200");
	break;

  case 'DELETE':
  	$id=$input["username"];
  	$value=$input["password"];

  	$insert_sells_query="delete from users where username=$1 and password=$2";
   	$result = pg_prepare($dbconn, "my_query10", $insert_sells_query);
	$result = pg_execute($dbconn, "my_query10", array($id, $value));

	$insert_sells_query="delete from highscores where username=$1";
   	$result = pg_prepare($dbconn, "my_query9", $insert_sells_query);
	$result = pg_execute($dbconn, "my_query9", array($id));
	header($_SERVER["SERVER_PROTOCOL"]." 200");
	break;
}
print json_encode($reply);
?>

