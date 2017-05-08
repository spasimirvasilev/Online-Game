// Stage
// Note: Yet another way to declare a class, using .prototype.

var cardwidth = 20;
var cardheight = 20;
var monster_count = 3;
var smart_monster_count = 1;
var box_count = 70;


function rand(min, max) {
	min = Math.ceil(min);
  	max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min)) + min;
}


function Stage(width, height, stageElementID){
	this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
	this.player=null; // a special actor, the player

	// the logical width and height of the stage
	this.width=width;
	this.height=height;

	// the element containing the visual representation of the stage
	this.stageElementID=stageElementID;

	// take a look at the value of these to understand why we capture them this way
	// an alternative would be to use 'new Image()'
	this.blankImageSrc=document.getElementById('blankImage').src;
	this.monsterImageSrc=document.getElementById('monsterImage').src;
	this.playerImageSrc=document.getElementById('playerImage').src;
	this.boxImageSrc=document.getElementById('boxImage').src;
	this.wallImageSrc=document.getElementById('wallImage').src;
	this.pikachuImageSrc = document.getElementById('pikachuImage').src;
}

// initialize an instance of the game
Stage.prototype.initialize=function(){
	// Create a table of blank images, give each image an ID so we can reference it later

	var s='<table>';
	itemtrack = 1;
	// set up the table with 20x20
	//'tr'=> # of rows == height 
	for (var y = 1; y <= this.height; y++){
		s+='<tr>';
		//for each row, there are x elements, x = width
		for (var x = 1; x <= this.width; x++){
			s+='<td>';
			var itemtrack = "stage_"+x+"_"+y;
			s+='<img src=' + this.blankImageSrc+' width='+cardwidth+'height='+cardheight+' id='+itemtrack+' />';
			s+=	'</td>';
			
		}
		s+='</tr>';

	}
	s+='</table>';

	// Put it in the stageElementID (innerHTML)
	document.getElementById("stage").innerHTML = s;
	// Add the player to the center of the stage
	//get the image at the middle, and replace with player's image
	var mx = (this.width/ 2) +1;
	var my = (this.height/ 2) +1;
	stage.setImage(mx, my, this.playerImageSrc);
	this.player = new player(mx, my, stage);
	var coord = stage.getStageId(mx, my);
	this.player.name = coord;
	stage.addActor(this.player);
	// Add walls around the outside of the stage, so actors can't leave the stage

	for (var y = 1; y <= this.height; y++){
		if (y==1 || y == this.height){
			for (var x = 1; x <= this.width; x++){
				stage.setImage(x, y, this.wallImageSrc);
			}
		}
		if (1< y < this.height){
			for (var x = 1; x <= this.width; x+= 19){
				stage.setImage(x, y, this.wallImageSrc);
			}
		}
	}
	// Add some Boxes to the stage
	// add xx boxes
	for (var i = 1; i < box_count + 1; i++){
		// add a check var s.t. no duplicate boxes gets added
		//var check = stage.getStageId(0, 0);
		var randx = rand(2, this.width);
		var randy = rand(2, this.height);
		//var boxlocation = stage.getStageId(randx, randy);
		if (document.getElementById(stage.getStageId(randx, randy)).src == stage.blankImageSrc && randx != mx && randy != my ){
			stage.setImage(randx, randy, this.boxImageSrc);
			var Box = new box(randx, randy, stage);
			Box.name = stage.getStageId(randx, randy);
			//stage.removeActor(stage.getActor(randx, randy));
			stage.addActor(Box);
		}else{
			i -= 1;
		}

	}

	
	// Add in some Monsters

	for (var i = 1; i < monster_count+1; i++){
		// add a check var s.t. no duplicate boxes gets added
		//var check = stage.getStageId(0, 0);
		var randx = rand(2, this.width);
		var randy = rand(2, this.height);
		//var boxlocation = stage.getStageId(randx, randy);
		if (document.getElementById(stage.getStageId(randx, randy)).src == stage.blankImageSrc && randx != mx && randy != my){
			stage.setImage(randx, randy, this.monsterImageSrc);
			var Monster = new monster(randx, randy, "monster");
			Monster.name = stage.getStageId(randx, randy);
			stage.removeActor(stage.getActor(randx, randy));
			stage.addActor(Monster);

		}else{
			i -= 1;
		}
	}
 
	
	// adding the smart monster
	for (var i = 1; i < smart_monster_count + 1; i+=1){
		var randx = rand(2, this.width);
		var randy = rand(2, this.height);
		if (document.getElementById(stage.getStageId(randx, randy)).src == stage.blankImageSrc && randx != mx && randy != my){
			stage.setImage(randx, randy, this.pikachuImageSrc);
			var pikachu = new smart_monster(randx, randy, "pikachu");
			pikachu.name = stage.getStageId(randx, randy);
			stage.removeActor(stage.getActor(randx, randy));
			stage.addActor(pikachu);
		}else{
			i -= 1;
		}
	}

}
// Return the ID of a particular image, useful so we don't have to continually reconstruct IDs
Stage.prototype.getStageId=function(x,y){ 
	return "stage_"+x+"_"+y; 
}

Stage.prototype.addActor=function(actor){
	this.actors.push(actor);
}

Stage.prototype.removeActor=function(actor){
	// Lookup javascript array manipulation (indexOf and splice).
	var index = this.actors.indexOf(actor);
	if (index > -1){
		this.actors.splice(index, 1);
	}
}

// Set the src of the image at stage location (x,y) to src
Stage.prototype.setImage=function(x, y, src){
	var itemtrack = "stage_"+x+"_"+y;
	document.getElementById(itemtrack).src = src;

}

// Take one step in the animation of the game.  
Stage.prototype.step=function(){
	if (monsterskilled + smartmonsterskilled==monster_count + smart_monster_count){
		won = 1;
		endGame();
		return;
	}
	for(var i=0;i<this.actors.length;i++){
		// each actor takes a single step in the game
		if(this.actors[i].type == "monster"){
			this.actors[i].move();
			this.actors[i].detect();
		}
		else if(this.actors[i].type == "player"){
			if(this.actors[i].life == 0){
				stage.removeActor(stage.player);
				stage.player = null;
				endGame();
				break;
			}
			
		}else if(this.actors[i].type == "pikachu"){
			this.actors[i].smart_move();
			this.actors[i].detect();
			//monster.prototype.detect.call(this.actors[i]);
		}
	}
}
// return the first actor at coordinates (x,y) return null if there is no such actor
// there should be only one actor at (x,y)!
Stage.prototype.getActor=function(x, y){
	for (var i=0;i<this.actors.length;i++){
		if (stage.getStageId(x, y)==this.actors[i].name){
			return this.actors[i];
		}
	}

	return null;
}
// End Class Stage

function player(x, y, stage){
	this.x = x;
	this.y = y;
	this.stage = stage;
	this.name = null;
	this.type = "player";
	this.life = 1;
}

player.prototype.gameOver = function(){
	this.life = 0;
	stage.setImage(this.x, this.y, stage.blankImageSrc);
}

player.prototype.move = function(direction){
	var v1 = this.x;
	var v2 = this.y;
	steps++;
	//score = Math.floor(Math.pow(0.5,(steps*0.01))*100) + monsterskilled*50;
	document.getElementById("score").innerHTML = "Steps: " + steps + "&nbsp;&nbsp;&nbsp;&nbsp;Monsters Killed: " + monsterskilled + "&nbsp;&nbsp;&nbsp;&nbsp;Score: " + score;
	if(direction.includes("N")){
		v2-=1;
	}
	if(direction.includes("S")){
		v2+=1;
	}
	if(direction.includes("W")){
		v1-=1;
	}
	if(direction.includes("E")){
		v1+=1;
	}
	if (document.getElementById(stage.getStageId(v1, v2)).src == stage.blankImageSrc){
		stage.setImage(this.x, this.y, stage.blankImageSrc);
		stage.setImage(v1, v2, stage.playerImageSrc);
		stage.getActor(this.x, this.y).name = stage.getStageId(v1, v2);
		this.update(v1, v2);
	}else if(document.getElementById(stage.getStageId(v1, v2)).src == stage.boxImageSrc){
		if (stage.getActor(v1,v2).move(direction)){
			stage.setImage(this.x, this.y, stage.blankImageSrc);
			stage.setImage(v1, v2, stage.playerImageSrc);
			stage.getActor(this.x, this.y).name = stage.getStageId(v1, v2);
			this.update(v1, v2);
		}
	}else if (document.getElementById(stage.getStageId(v1, v2)).src == stage.monsterImageSrc){
		this.gameOver();
	}
}

function box(x, y, stage){
	this.x = x;
	this.y = y;
	this.stage = stage;
	this.name = null;
	this.type = "box";
}

box.prototype.move = function(direction){
	var v1 = this.x;
	var v2 = this.y;
	//alert(v1 + " " + v2);
	if(direction.includes("N")){
		v2-=1;
	}
	if(direction.includes("S")){
		v2+=1;
	}
	if(direction.includes("W")){
		v1-=1;
	}
	if(direction.includes("E")){
		v1+=1;
	}

	if (document.getElementById(stage.getStageId(v1, v2)).src == stage.blankImageSrc){
		stage.setImage(this.x, this.y, stage.blankImageSrc);
		stage.setImage(v1, v2, stage.boxImageSrc);
		stage.getActor(this.x, this.y).name = stage.getStageId(v1, v2);
		this.update(v1, v2);
		return true;
	}
	if (document.getElementById(stage.getStageId(v1, v2)).src == stage.boxImageSrc){
		if (stage.getActor(v1,v2).move(direction)){
			stage.setImage(this.x, this.y, stage.blankImageSrc);
			stage.setImage(v1, v2, stage.boxImageSrc);
			stage.getActor(this.x, this.y).name = stage.getStageId(v1, v2);
			this.update(v1, v2);
			return true;
		}
		else{
			return false;
		}

	}
	if (document.getElementById(stage.getStageId(v1, v2)).src == stage.monsterImageSrc){
		return false;
	}
	if (document.getElementById(stage.getStageId(v1, v2)).src == stage.wallImageSrc){
		return false;
	}
}

function monster(x, y, type){
	this.x = x; 
	this.y = y;
	this.stage = stage;
	this.name = null;
	this.type = type;
	var forward = true;
	this.life = 1;
}

//make a smart monster which inheritance functions from normal monster

function smart_monster(x, y, type){
	monster.call(this, x, y, type);
}

smart_monster.prototype = Object.create(monster.prototype);

smart_monster.prototype.smart_move = function(){
	var x = this.x;
	var y = this.y;
	var direction = ["N", "W", "S", "E", "NW", "SE", "SW", "NE"];
	var blank = [];

	for(var i = 0; i < direction.length; i++){
		if(monster.prototype.detect_player.call(this, direction[i])){
			x = position_change_x(x, direction[i]);
			y = position_change_y(y, direction[i]);
			stage.setImage(this.x, this.y, stage.blankImageSrc);
			stage.setImage(x, y, stage.pikachuImageSrc);
			stage.getActor(this.x, this.y).name = stage.getStageId(x, y);
			monster.prototype.update.call(this, x, y);
			stage.player.gameOver();
		}
	}

	//if no player can be find around it, then find random blank space to go to 
	for (var i = 0; i < direction.length; i++){
		if (monster.prototype.detect_blank.call(this, direction[i])){	
			blank.push(direction[i]);
		}
	}
	if (blank.length == 0 || blank === undefined){
		
	}
	else{
		var escape = rand(0, blank.length);
		x = position_change_x(x, blank[escape]);
		y = position_change_y(y, blank[escape]);
		stage.setImage(this.x, this.y, stage.blankImageSrc);
		stage.setImage(x, y, stage.pikachuImageSrc);
		stage.getActor(this.x, this.y).name = stage.getStageId(x, y);
		monster.prototype.update.call(this, x, y);
	}

	

}

function position_change_x (x, direction){
	if(direction.includes("W")){
		x-=1;
	}
	if(direction.includes("E")){
		x+=1;
	}
	return x;
}

function position_change_y(y, direction){
	if(direction.includes("N")){
		y-=1;
	}
	if(direction.includes("S")){
		y+=1;
	}
	return y;
}

monster.prototype.detect_blank = function(direction){
	var x = this.x;
	var y = this.y;
	
	x = position_change_x (x, direction);
	y = position_change_y (y, direction);
	
	if (document.getElementById(stage.getStageId(x, y)).src == stage.blankImageSrc){
		return true;
	}
}

monster.prototype.detect_wall = function(direction){
	var x = this.x;
	var y = this.y;
	
	x = position_change_x (x, direction);
	y = position_change_y (y, direction);
	
	if (document.getElementById(stage.getStageId(x, y)).src == stage.wallImageSrc){
		return true;
	}
}

monster.prototype.detect_box = function(direction){
	var x = this.x;
	var y = this.y;
	
	x = position_change_x (x, direction);
	y = position_change_y (y, direction);
	
	if (document.getElementById(stage.getStageId(x, y)).src == stage.boxImageSrc){
		return true;
	}
}

monster.prototype.detect_player = function(direction){
	var x = this.x;
	var y = this.y;
	
	x = position_change_x (x, direction);
	y = position_change_y (y, direction);
	
	if (document.getElementById(stage.getStageId(x, y)).src == stage.playerImageSrc){
		return true;
	}
}


monster.prototype.detect_monster = function(direction){
	var x = this.x;
	var y = this.y;
	
	x = position_change_x (x, direction);
	y = position_change_y (y, direction);
	
	if (document.getElementById(stage.getStageId(x, y)).src == stage.monsterImageSrc){
		return true;
	}
}



//detect if monster's surrounded
smart_monster.prototype.smart_detect = function(){
	var x = this.x;
	var y = this.y;

	if ((monster.prototype.detect_wall.call(this,"N") || monster.prototype.detect_box.call(this,"N") || monster.prototype.detect_monster.call(this,"N"))
		&& (monster.prototype.detect_wall.call(this,"S") || monster.prototype.detect_box.call(this,"S") || monster.prototype.detect_monster.call(this,"S"))
		&& (monster.prototype.detect_wall.call(this,"W")|| monster.prototype.detect_box.call(this,"W")|| monster.prototype.detect_monster.call(this,"W"))
		&& (monster.prototype.detect_wall.call(this,"E") || monster.prototype.detect_box.call(this,"E") || monster.prototype.detect_monster.call(this,"E"))
		&& (monster.prototype.detect_wall.call(this,"NW") || monster.prototype.detect_box.call(this,"NW") || monster.prototype.detect_monster.call(this,"NW"))
		&& (monster.prototype.detect_wall.call(this,"NE")|| monster.prototype.detect_box.call(this,"NE") || monster.prototype.detect_monster.call(this,"NE"))
		&& (monster.prototype.detect_wall.call(this,"SW") || monster.prototype.detect_box.call(this,"SW") || monster.prototype.detect_monster.call(this,"SW"))
		&& (monster.prototype.detect_wall.call(this,"SE")|| monster.prototype.detect_box.call(this,"SE")|| monster.prototype.detect_monster.call(this,"SE"))){
			alert("yoyoyoy");

			this.life = 0;
			monsterskilled++;
			score += 100;
			document.getElementById("score").innerHTML = "Steps: " + steps + "&nbsp;&nbsp;&nbsp;&nbsp;Monsters Killed: " + monsterskilled + "&nbsp;&nbsp;&nbsp;&nbsp;Score: " + score;
			stage.setImage(x, y, stage.blankImageSrc);
			stage.removeActor(stage.getActor(x,y));
	}

}

monster.prototype.detect = function(){
	var x = this.x;
	var y = this.y;

	if ((this.detect_wall("N") || this.detect_box("N") || this.detect_monster("N"))
		&& (this.detect_wall("S") || this.detect_box("S") || this.detect_monster("S"))
		&& (this.detect_wall("W") || this.detect_box("W") || this.detect_monster("W"))
		&& (this.detect_wall("E") || this.detect_box("E") || this.detect_monster("E"))
		&& (this.detect_wall("NW") || this.detect_box("NW") || this.detect_monster("NW"))
		&& (this.detect_wall("NE") || this.detect_box("NE") || this.detect_monster("NE"))
		&& (this.detect_wall("SW") || this.detect_box("SW") || this.detect_monster("SW"))
		&& (this.detect_wall("SE") || this.detect_box("SE") || this.detect_monster("SE"))){
			if(this.type == "pikachu"){
				smartmonsterskilled++;
			}
			else if (this.type == "monster"){
				monsterskilled++;
			}
			this.life = 0;
			score = Math.floor(Math.pow(0.5,(steps*0.01))*100) + monsterskilled*50 + smartmonsterskilled*100;
			document.getElementById("score").innerHTML = "Steps: " + steps + "&nbsp;&nbsp;&nbsp;&nbsp;Monsters Killed: " + monsterskilled + "&nbsp;&nbsp;&nbsp;&nbsp;Score: " + score;
			stage.setImage(x, y, stage.blankImageSrc);
			stage.removeActor(stage.getActor(x,y));
	}
}

//update monster's position
monster.prototype.update = function(x, y){
	this.x = x;
	this.y = y;
}

//update box's position
box.prototype.update = function(x, y){
	this.x = x;
	this.y = y;
}

//update player's position
player.prototype.update = function(x, y){
	this.x = x;
	this.y = y;
}

//function that will make monster move diagnolly
monster.prototype.move = function(){
	var v1 = this.x;
	var v2 = this.y;
	//stage.getActor(v1, v2).type == "blank"
	if(this.detect_player("NE")&& this.forward){
		stage.setImage(v1, v2, stage.blankImageSrc);
		stage.setImage(v1+1, v2-1, stage.monsterImageSrc);
		stage.getActor(v1, v2).name = stage.getStageId(v1+1, v2-1);
		this.update(v1+1, v2-1);
		stage.player.gameOver();
	}
	else {
		if (this.detect_blank("NE") && this.forward){
		stage.setImage(v1, v2, stage.blankImageSrc);
		stage.setImage(v1+1, v2-1, stage.monsterImageSrc);
		stage.getActor(v1, v2).name = stage.getStageId(v1+1, v2-1);
		this.update(v1+1, v2-1);
		}
		else{
			this.forward = false;
		}
	}
	if (this.detect_player("WS") && !this.forward){
		stage.setImage(v1, v2, stage.blankImageSrc);
		stage.setImage(v1-1, v2+1, stage.monsterImageSrc);
		stage.getActor(v1, v2).name = stage.getStageId(v1-1, v2+1);
		this.update(v1-1, v2+1);
		stage.player.gameOver();
	}
	else{
		if (this.detect_blank("WS") && !this.forward){
		stage.setImage(v1, v2, stage.blankImageSrc);
		stage.setImage(v1-1, v2+1, stage.monsterImageSrc);
		stage.getActor(v1, v2).name = stage.getStageId(v1-1, v2+1);
		this.update(v1-1, v2+1);
		} 
		else{
			this.forward = true;
		}
	}
}