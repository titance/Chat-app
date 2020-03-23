// const users = []


// const adduser = ({ id, username, room }) => {
//     //clean the data
//     username = username.trim().toLowerCase()
//     room = room.trim().toLowerCase()

//     //validate the data
//     if (!username || !room) {
//         return {
//             error: 'username and room required'
//         }
//     }
//     //check existing user
//     const existinguser = users.find((user) => {
//         return user.room === room && user.username === username
//     })

//     // validate  username
//     if (existinguser) {
//         return {
//             error: 'username is in use '

//         }
//     }

//     //store user
//     const user = { id, username, room }
//     users.push(user)
//     return (user)


// }


// const removeuser = (id) => {
//     const index = users.findIndex((user) => user.id === id)

//     if (index !== -1) {
//         return users.splice(index, 1)[0]
//     }

// }

// const getuser = (id) => {
//     return users.find((user) => user.id === id)

// }

// const getuserinroom = (room) => {
//     return users.filter((user) => user.room === room)
// }




// module.exports = {
//     adduser,
//     removeuser,
//     getuser,
//     getuserinroom
// }

const users = []

const addUser = ({
    id,
    username,
    room
}) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = {
        id,
        username,
        room
    }
    users.push(user)
    return {
        user
    }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}