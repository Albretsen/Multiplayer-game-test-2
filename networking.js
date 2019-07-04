  // Networking functions

  // When a different client disconnets, remove them from the playerArray
  function client_disconnect(data){
    var index
    for(var i = 0; i < playerArray.length; i++){
      if(playerArray[i].id === data.id){
        index = i
      }
    }
    playerArray.splice(index, 1)
  }
  
  // When a different client updates their position, update their position
  // in the playerArray as well. If the client doesn't already exist in
  // the array, then add the new client to the array.
  function pos_update(data) { 
    var clientFound = false;
    playerArray.forEach(function(element){
      if(element.id === data.id){
        element.x = data.x
        element.y = data.y
        clientFound = true
      }
    })
    if(!clientFound){
      var newPlayer = new Player()
      newPlayer.id = data.id
      newPlayer.x = data.x
      newPlayer.y = data.y
      playerArray.push(newPlayer)
    }
  }
  
  // When a different client updates their arm position, update their arm
  // position in the playerArray as well.
  function armVector_update(data) {
    var clientFound = false;
    playerArray.forEach(function(element){
      if (element.id === data.id){
        element.armVector.x = data.x
        element.armVector.y = data.y
        clientFound = true
      }
    })
  }
  
  // This function will send this clients position to the server, who will then
  // send the position to all connected clients, except this client.
  function emit_pos() {
    if (clientPlayer.id === "" || clientPlayer.id == undefined || clientPlayer == null) {
      clientPlayer.id = socket.id
    }
  
    socket.emit("pos_update", {
      x: clientPlayer.x,
      y: clientPlayer.y,
      id: clientPlayer.id
    })
  }
  
  // This function will send this clients arm vector to the server, who will then
  // send the arm vector to all connected clients, except this client.
  function emit_armVector() {
    if (clientPlayer.id === "" || clientPlayer.id == undefined || clientPlayer == null) {
      clientPlayer.id = socket.id
    }
  
    socket.emit("armVector_update", {
      x: clientPlayer.armVector.x,
      y: clientPlayer.armVector.y,
      id: clientPlayer.id
    })
  }
  
  // If a new client connects, the server will call the "new_client" function in all
  // previously connected clients. It will add the new client to all clients 
  // playerArray, and also each client will emit their position and arm vector.
  function new_client(data) {
    var newPlayer = new Player()
    newPlayer.id = data.id
    playerArray.push(newPlayer)
  
    emit_pos()
    emit_armVector()
  }

  // This function will be called when a new bullet is instantiated. It will send the
  // initial position and directional vector to the server. This info will be sent to
  // all connected clients, who will handle the bullet movement on their own.
  function emit_bullet(x, y, dir) {
      socket.emit("bullet_update", {
          x: x,
          y: y,
          dir: dir
      })
  }

  function bullet_update(data) {
      bulletArray.push(new Bullet(data.x, data.y, data.dir))
  }