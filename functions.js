stage=null;
var keys = {};
interval=null;
username=null;
password=null;
steps=0;
monsterskilled = 0;
smartmonsterskilled = 0;
score=0
won=0
function setupGame(){
	stage=new Stage(20,20,"stage");
	stage.initialize();
	interval = setInterval(function(){stage.step();}, 500);
}
function startGame(){
	score=0;
	monsterskilled = 0;
	smartmonsterskilled = 0;
	steps=0;
	won=0;
	hideErrors();
	hideDivs();
	document.getElementById("score").innerHTML = "Steps: " + steps + "&nbsp;&nbsp;&nbsp;&nbsp;Monsters Killed: " + monsterskilled + "&nbsp;&nbsp;&nbsp;&nbsp;Score: " + score;
	document.getElementById("game").style = "display:block";
	document.getElementById("navProfile").style = "display:block";
	document.getElementById("navLogout").style = "display:block";
	document.getElementById("score").style = "display:block";
	updateTimesPlayed();
	setupGame();
}
function pauseGame(){
	if(interval == null){
		interval = setInterval(function(){stage.step(); }, 500);
	} else{
		clearInterval(interval);
		interval = null;
	}
}
function endGame(){
	stage = null;
	clearInterval(interval);
	hideDivs();
	recordScore(score);
	if(won)document.getElementById("win").style = "display:block";
	else document.getElementById("lose").style = "display:block";
	document.getElementById("endmessage").innerHTML = "Score: " + score;
	document.getElementById("gameover").style = "display:block";
	document.getElementById("navigation").style = "display:block";
	document.getElementById("navProfile").style = "display:block";
	document.getElementById("navLogout").style = "display:block";
}

function recordScore(score){
	var params = { 
		method: "POST", 
		url: "api/api.php", 
		data: { "username":username, "score":score, "password":password} 
		};
		$.ajax(params).done();
}

$(document).keydown(function(e){
	if (stage != null){
		keys[e.which] = true;
		detectMove();
	}
});

function detectMove() {
    var key = '';
    for (var i in keys) {
        if (!keys.hasOwnProperty(i)) continue;
        key += String.fromCharCode(i);
    }
    if (stage.player != null && interval!=null){
    	if (key=="A")stage.player.move("W");
		if (key=="W")stage.player.move("N");
		if (key=="D")stage.player.move("E");
		if (key=="X")stage.player.move("S");
		if (key=="S")stage.player.move("S");
		if (key=="Q")stage.player.move("NW");
		if (key=="E")stage.player.move("NE");
		if (key=="Z")stage.player.move("SW");
		if (key=="C")stage.player.move("SE");
    }
	keys = {};
}

function login(){
	document.formlogin.username.value = "";
	document.formlogin.password.value = "";
	hideErrors();
	hideDivs();
	topScores();
	document.getElementById("login").style = "display:block";
	document.getElementById("topscores").style = "display:block";
}
function logout(){
	username=null;
	login();
}
function register(){
	hideErrors();
	hideDivs();
	document.getElementById("register").style = "display:block";
}

function profile(){
	hideErrors();
	hideDivs();
	document.getElementById("profile").style = "display:block";
	document.getElementById("navigation").style = "display:block";
	document.getElementById("navStartGame").style = "display:block";
	document.getElementById("navLogout").style = "display:block";
}

function deleteProfile(){
	var r = confirm("Are you sure you want to delete your profile?");
	if (r == true) {
	    var params = { 
		method: "DELETE", 
		url: "api/api.php", 
		data: { "username":username, "password":password} 
		};
		$.ajax(params).done(function(){
			logout();
		});
	}
}

function validateLogin(){
	var a = document.formlogin.username.value;
	username = a;
	var b = document.formlogin.password.value;
	password = b;
	if (a=="" || b==""){
		hideErrors();
		document.getElementById("InvLogin").style = "display:block";
		return false;
	}
	else{
		var params = { 
		method: "GET", 
		url: "api/api.php", 
		data: { "username":a, "password":b} 
		};
		$.ajax(params).done(function(data){
			if (data.valid == true){
				updateLastDate();
				profile();
			}
			else{
				hideErrors();
				document.getElementById("InvPass").style = "display:block";
				return false;
			}
		});
	}
}

function updateTimesPlayed(){
	var params = { 
		method: "POST", 
		url: "api/api.php", 
		data: { "username":username, "updatetimes":true, "password":password} 
		};
	$.ajax(params).done();
}

function updateLastDate(){
	var params = { 
		method: "POST", 
		url: "api/api.php", 
		data: { "username":username, "changedate":true, "password":password} 
		};
	$.ajax(params).done();
}

function validateRegister(){
	var a = document.formregister.username.value;
	username = a;
	var b = document.formregister.password.value;
	password = b;
	var c = document.formregister.email.value;
	if (a=="" || b=="" || c==""){
		hideErrors();
		document.getElementById('InvReg').style = "display:block";
		return false;
	}
	else{
		var params = { 
		method: "GET", 
		url: "api/api.php", 
		data: { "username":a} 
		};
		var errorsPresent = false;
		if(validateEmail(c) == false){
			hideErrors();
			document.getElementById('InvEmail').style = "display:block";
			errorsPresent = true;
		}
		if(!isAlphanum(a) || !isAlphanum(b)){
			document.getElementById("NoAlphaNum").style = "display:block";
			errorsPresent = true;
		}
		if (errorsPresent)return false;
		$.ajax(params).done(function(data){
			if (data.username == null){ //user doesnt exist
				addUser(a,b,c);
				startGame();
			}
			else{  //user already exists
				hideErrors();
				document.getElementById("ExistsUser").style = "display:block";
				return false;
			}
		});
	}
}

function updateProfile(){
	var b = document.formedit.password.value;
	var c = document.formedit.email.value;
	if (b=="" && c==""){
		hideErrors();
		document.getElementById('NoChange').style = "display:block";
		return false;
	}
	else{
		var params = { 
		method: "POST", 
		url: "api/api.php", 
		data: { "username":username, "password":b, "email":c, "oldpassword":password} 
		};
		var errorsPresent = false;

		if(validateEmail(c) == false && c != ""){
			hideErrors();
			document.getElementById('InvEmail').style = "display:block";
			errorsPresent = true;
		}
		if(!isAlphanum(b) && b != ""){
			document.getElementById("NoAlphaNum").style = "display:block";
			document.getElementById('InvReg').style = "display:none";
			errorsPresent = true;
		}
		if (errorsPresent){
			document.getElementById("Change").style = "display:none";
			return false;
		}
		$.ajax(params).done(function(data){
			hideErrors();
			document.getElementById("Change").style = "display:block";
			if (b!=""){
				password = b;
			
			}

		});

	}

}

function topScores(){
	var params = { 
		method: "GET", 
		url: "api/api.php", 
		data: {"scores":"yes"} 
		};
	var a = "";
	$.ajax(params).done(function(data){
		a+="<tr><td style='padding:15px'>User</td><td style='padding:15px'>HighScore</td></tr>"
		for (i in data.scoresarray){
			a+= "<tr><td style='padding-right:10px'><center>" + 
			data.scoresarray[i].username + "</center></td>" + 
			"<td style='padding-left:10px'><center>" + data.scoresarray[i].highscore + "</center></td></tr>";
		}
		document.getElementById("scorestable").innerHTML = a;
	});
}

function hideErrors(){
	document.getElementById('InvEmail').style = "display:none";
	document.getElementById("ExistsUser").style = "display:none";
	document.getElementById('InvReg').style = "display:none";
	document.getElementById("NoAlphaNum").style = "display:none";
	document.getElementById("NoChange").style = "display:none";
	document.getElementById("Change").style = "display:none";
	document.getElementById("InvLogin").style = "display:none";
	document.getElementById("InvPass").style = "display:none";
}

function hideDivs(){
	document.getElementById("register").style = "display:none";
	document.getElementById("login").style = "display:none";
	document.getElementById("profile").style = "display:none";
	document.getElementById("navigation").style = "display:none";
	document.getElementById("navStartGame").style = "display:none";
	document.getElementById("navLogout").style = "display:none";
	document.getElementById("navProfile").style = "display:none";
	document.getElementById("game").style = "display:none";
	document.getElementById("gameover").style = "display:none";
	document.getElementById("score").style = "display:none";
	document.getElementById("win").style = "display:none";
	document.getElementById("lose").style = "display:none";
	document.getElementById("topscores").style = "display:none";
}

function validateEmail(email){
	var atpos = email.indexOf("@");
	var dotpos = email.lastIndexOf(".");
	if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {
		return false;
	}
	return true;

}
function isAlphanum(str){
	var Exp = /^[0-9a-z]+$/;
	if(!str.match(Exp)){
		return false;
	}
	return true;
}
function addUser(a,b,c){
	var params = { 
		method: "PUT", 
		url: "api/api.php", 
		data: {"username":a, "password":b, "email":c} 
	};
	$.ajax(params);
}

$(function(){
	login();
});
