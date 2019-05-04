var express = require('express')()
var http = require('http').Server(express)
var serverSocket = require('socket.io')(http)
var listaDeConectados = []
const porta = process.env.PORT || 8000
const host = process.env.HOST || "http://localhost"

http.listen(porta, () => {
    const portaStr = (porta == 80) ?  '' :  ':' + porta
    console.log('Servidor iniciado. Abra o navegador em ' + host + portaStr)
})

express.get('/', function(requisicao, resposta){
    resposta.sendFile(__dirname + '/index.html')
})

serverSocket.on('connect', socket => {
    console.log('\nCliente conectado: ' + socket.id)
    socket.broadcast.emit('onLine',listaDeConectados)

    socket.on('disconnect', () => {
        console.log('Cliente desconectado: ' + socket.id)
    })

    socket.on('sair', nick => {
        let index = listaDeConectados.indexOf(nick)
        listaDeConectados.splice(index, 1)
        console.log('Clientes restantes: '+listaDeConectados)
        socket.broadcast.emit('conectados',listaDeConectados)
    })

    socket.on('chat mensagem', (nick,msg) => {
        console.log('Mensagem('+nick+'): ' + msg)
        serverSocket.emit('chat mensagem',nick, msg)//envia mensagem para todos
    })

    socket.on('status', msg => socket.broadcast.emit('status', msg))

    socket.on('conectado', nickname => {
        if(listaDeConectados.indexOf(nickname.toLowerCase()) == -1)//bloqueia a entrada de nicks repetidos
            listaDeConectados.push(nickname)
        console.log(listaDeConectados)
        socket.broadcast.emit('conectados', listaDeConectados)//envia o nick do cliente conectado
    })
    
})