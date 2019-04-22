var express = require('express')()
var http = require('http').Server(express)
var serverSocket = require('socket.io')(http)
var porta = 8000

http.listen(porta, function(){
    if(porta == 80){portaStr = ''}
    else{portaStr = ':' + porta}
    console.log('Servidor iniciado. Abra o navegador em http://localhost' + portaStr)
})

express.get('/', function(requisicao, resposta){
    resposta.sendFile(__dirname + '/index.html')
})

serverSocket.on('connect', function(socket){
    console.log('\nCliente conectado: ' + socket.id)

    socket.on('disconnect', function(){
        console.log('Cliente desconectado: ' + socket.id)
    })

    socket.on('chat mensagem', function(nick,msg){
        console.log('Mensagem('+nick+'): ' + msg)
        serverSocket.emit('chat mensagem',nick, msg)//envia mensagem para todos
    })

    socket.on('status', function(msg){
        socket.broadcast.emit('status', msg)
    })
    
})