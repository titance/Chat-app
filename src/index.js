const path = require('path')
const http = require('http')
const socketio = require('socket.io')
express = require('express')
const Filter = require('bad-words')
const { generatemessage, generatelocationmessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000
const publicdirectorypath = path.join(__dirname, '../public')

app.use(express.static(publicdirectorypath))


io.on('connection', (socket) => {
    console.log('new websocket connection ')

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('message', generatemessage('admin', 'welcome'))
        socket.broadcast.to(user.room).emit('message', generatemessage('Admin', user.username + ' has joined !'))
        io.to(user.room).emit('roomdata', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })


    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('profanity is not allowed ')
        }
        io.to(user.room).emit('message', generatemessage(user.username, message))
        callback('Delivered...!')
    })

    socket.on('sendlocation', (l, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationmessage', generatelocationmessage(user.username, 'https://www.google.com/maps?q=' + l.latitude + ',' + l.logitude))

        callback('location has been send..!')
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generatemessage('A user has left !!'))
            io.to(user.room).emit('roomdata', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
        //io.emit('message', generatemessage('user has left '))
    })
})


server.listen(PORT, () => {
    console.log('Server is on port ', PORT)

})