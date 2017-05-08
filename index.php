<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta HTTP-EQUIV="EXPIRES" CONTENT="-1">
		<title>Computing Science 309 Warehouse Wars</title>
		<script language="javascript" src="jquery-3.1.1.min.js" > </script>
		<script language="javascript" src="ww.js" > </script>
		<script language="javascript" src="functions.js" > </script>
		<link rel="stylesheet" type="text/css" href="style.css" />
	</head>
	<body bgcolor="ffffaf">
		<center>
			<h1>Warehouse Wars</h1>

			<div style="display:none" id="login"> 
				<form name="formlogin">
					<input type="text" name="username" placeholder="username"><br>
					<input type="password" name="password" placeholder="password"><br>
				</form>
				<button type="button" value="Submit" onclick="validateLogin();">Log In</button>
				<p class="message" onclick="register();">Not registered? <a href="#">Create an account</a></p>

			</div>
			<div style="display:none" id="register"> 
				<p>Sign up:</p>
				<form name="formregister"> 
					<input type="text" name="username" placeholder="username"><br>
					<input type="password" name="password" placeholder="password"><br>
					<input type="email" name="email" placeholder="email"><br>
				</form>
				<button type="button" value="Register" onclick="validateRegister();">Register</button>
				<p class="message" onclick="login();">Already registered? <a href="#">Sign In</a></p>
				
			</div>
			<div style="display:none" id="profile">
				<p>Edit Profile:</p>
				<form name="formedit"> 
					<input type="password" name="password" placeholder="password"><br>
					<input type="email" name="email" placeholder="email"><br>
				</form>
				<button type="button" value="Update" onclick="updateProfile();">Submit</button>
				<p><button type="button" value="DeleteProfile" style="background:#ff0000" onclick="deleteProfile();">Delete Profile</button>
			</div>
			<p style="display:none" id="NoChange">No Changes Made</p>
			<p style="display:none" id="Change">Changes Made Successfully</p>
			<p style="display:none" id="InvReg">Empty Fields Exist</p>
			<p style="display:none" id="ExistsUser">Username already exists</p>
			<p style="display:none" id="InvEmail">Not a valid email address</p>
			<p style="display:none" id="NoAlphaNum">Username and Password can only contain numbers and letters</p>
			<p style="display:none" id="InvLogin">Empty Fields Exist</p>
			<p style="display:none" id="InvPass">Invalid Username or Password</p>

			<div style="display:none" id="navigation">
				<nav>
				<ul>
                    <li> <a href="#" style="display:none" id="navStartGame" onclick="startGame();">Start Game</a>
                    <li> <a href="#" style="display:none" id="navProfile" onclick="profile();">Profile</a>
                    <li> <a href="#" style="display:none" id="navLogout" onclick="logout();">Logout</a>
                </ul>
				</nav>
			</div>

			<div style="display:none" id="gameover">
				<center>
					<h4 id="lose" style="display:none">Game Over</h4>
					<h4 id="win" style="display:none">You Win</h4>
					<p id="endmessage"></p></center>
				<button onclick="startGame();" style="width:20%">Play Again</button>
			</div>

			<div style="display:none" id="topscores">
				<center><h3>Top Scores:</h3></center>
				<table id="scorestable">
				</table>
			</div>

			<p style="display:none" id="score"></p>
			<div style="display:none" id="game">
			<table>
				<tr>
					<td> <div id="stage"> </div></td> 
					<td>
						<center>
							<h2>Legend</h2>
							<table class="legend">
								<tr>
									<td style="padding:7px;"> <img src="icons/blank.gif" id="blankImage" style="height:20px; width:20px;"/> </td>
									<td style="padding:7px;"> <img src="icons/emblem-package-2-24.png" id="boxImage" style="height:20px; width:20px"/> </td>
									<td style="padding:7px;"> <img src="icons/face-cool-24.png" id="playerImage" style="height:20px; width:20px"/> </td>
									<td style="padding:7px;"> <img src="icons/face-devil-grin-24.png" id="monsterImage" style="height:20px; width:20px"/> </td>
									<td style="padding:7px;"> <img src="icons/wall.jpeg" id="wallImage" style="height:20px; width:20px"/> </td>
									<td style="padding:7px;"> <img src="icons/pikachu-icon.png" id="pikachuImage" style="height:20px; width:20px"/> </td>
								</tr>
								<tr>
									<td style="padding:7px;"> Empty <br/> Square </td>
									<td style="padding:7px;"> Box </td>
									<td style="padding:7px;"> Player </td>
									<td style="padding:7px;"> Monster </td>
									<td style="padding:7px;"> Wall </td>
									<td style="padding:7px;">Smart <br/>Monster</td>
								</tr>
							</table>
							<h2>Controls</h2>
							<table class="controls">
								<tr>
									<td><img src="icons/north_west.svg" onclick="stage.player.move('NW')" style="height:70px; width:70px;"/></td>
									<td><img src="icons/north.svg" onclick="stage.player.move('N')" style="height:70px; width:70px;"/></td>
									<td><img src="icons/north_east.svg" onclick="stage.player.move('NE')" style="height:70px; width:70px;"/></td>
								</tr>
								<tr>
									<td><img src="icons/west.svg" onclick="stage.player.move('W')" style="height:70px; width:70px;"/></td>
									<td>&nbsp;</td>
									<td><img src="icons/east.svg" onclick="stage.player.move('E')" style="height:70px; width:70px;"/></td>
								</tr>
								<tr>
									<td><img src="icons/south_west.svg" onclick="stage.player.move('SW')" style="height:70px; width:70px;"/></td>
									<td><img src="icons/south.svg" onclick="stage.player.move('S')" style="height:70px; width:70px;"/></td>
									<td><img src="icons/south_east.svg" onclick="stage.player.move('SE')" style="height:70px; width:70px;"/></td>
								</tr>
							</table>
							
							<p><button onclick="pauseGame();" style="width:50%">Pause Game</button>
							<p><button onclick="endGame();" style="width:50%">Quit Game</button>
						</center>
					</td> 
				</tr>
			</table>
		</div>
		</center>
	</body>
</html>

