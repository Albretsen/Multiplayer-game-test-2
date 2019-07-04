var socket

var playerWidth = 50
var playerHeight = 50
var playerSpeedMultiplier = 2
var playerArmLength = 50

var bulletSpeed = 3
var bulletSize = 10
var bulletArray

var canvWidth = 600
var canvHeight = 600

function Player() {
  this.x = canvWidth/2
  this.y = canvHeight/2
  this.armVector = createVector(0, -100).setMag(playerArmLength)
  
  this.id = ""
}

function Point(x, y) {
  this.x = x
  this.y = y
}

function Bullet(x, y, dir) {
  this.x = x
  this.y = y
  this.dir = dir
  this.delete = false

  this.move = function () {
    this.x += dir.x * bulletSpeed
    this.y += dir.y * bulletSpeed
  }

  this.distance_from_center = function () {
    return find_vector(new Point(this.x, this.y), new Point(width/2, height/2)).mag()
  }
}

var theVar

function superTest() {
  console.log("SUPER TEST WAS CALLED!")
  theVar = 10
}

var playerArray
var clientPlayer

function setup() {

  createCanvas(canvWidth, canvHeight)

  console.log("The var " + theVar)

  // Configure the receiving networked functions.
  socket = io.connect('http://localhost:3000')
  socket.on('new_client', new_client)
  socket.on('pos_update', pos_update)
  socket.on('armVector_update', armVector_update)
  socket.on('bullet_update', bullet_update)
  socket.on('client_disconnect', client_disconnect)
  
  playerArray = []
  bulletArray = []
  
  // Intialize client player
  clientPlayer = new Player()
  playerArray.push(clientPlayer)
}

function draw() {
  background(51)
  
  // Handle inputs
  inputs()

  // Handle all bullet logic
  update_bullets()
  
  // Draw all the players
  draw_players()
}

function draw_players(){
  playerArray.forEach(function(element){
    stroke(255)
    fill(255)
    strokeWeight(0)
    ellipse(element.x, element.y, playerWidth, playerHeight)

    strokeWeight(10)
    line(element.x, element.y, element.x + element.armVector.x, element.y + element.armVector.y)
  })
}

function inputs() {

  var posUpdated = false

  // Player direction input
  if (keyIsDown(LEFT_ARROW)) {
    clientPlayer.x -= 1 * playerSpeedMultiplier
    posUpdated = true
  }
  if (keyIsDown(RIGHT_ARROW)) {
    clientPlayer.x += 1 * playerSpeedMultiplier
    posUpdated = true
  }
  if (keyIsDown(UP_ARROW)) {
    clientPlayer.y -= 1 * playerSpeedMultiplier 
    posUpdated = true 
  }
  if (keyIsDown(DOWN_ARROW)) {
    clientPlayer.y += 1 * playerSpeedMultiplier
    posUpdated = true
  }

  // Arm direction input
  var prevArmVector = clientPlayer.armVector
  clientPlayer.armVector = find_vector(new Point(clientPlayer.x, clientPlayer.y), new Point(mouseX, mouseY)).setMag(playerArmLength)
  // If arm vector was updated
  if (prevArmVector.x != clientPlayer.armVector.x || prevArmVector.y != clientPlayer.armVector.y) {
    emit_armVector()
  }

  // Emit position if connection has been made
  if (posUpdated && socket.id != null) {
    emit_pos()
  }
}

function mouseClicked() {
  fire_bullet()
}

function fire_bullet() {
  bulletArray.push(new Bullet(clientPlayer.x + clientPlayer.armVector.x, clientPlayer.y + clientPlayer.armVector.y, clientPlayer.armVector.setMag(1)))

  emit_bullet(clientPlayer.x + clientPlayer.armVector.x, clientPlayer.y + clientPlayer.armVector.y, clientPlayer.armVector.setMag(1))
}

function update_bullets() {
  bulletArray.forEach(function(element){
    stroke(255)
    fill(255)
    strokeWeight(0)
    ellipse(element.x, element.y, bulletSize, bulletSize)

    element.move()

    if(element.distance_from_center() > width && element.distance_from_center() > width) {
      element.delete = true
    }
  })

  while(delete_bullets()) {}
}

function delete_bullets() {
  var index = 0
  var keep_going = false
  for(var i = 0; i < bulletArray.length; i++) {
    if(bulletArray[i].delete){
      index = i
      i = bulletArray.length
      keep_going = true
    }
  }
  if(keep_going) {
    bulletArray.splice(index, 1)
  }
  return keep_going
}