const socket = io()


//Elements
const $messageform = document.querySelector('message-form')
const $messageforminput = document.querySelector('input')
const $messageformbutton = document.querySelector('button')
const $sendlocationbutton = document.querySelector('sendlocation')
const $messages = document.querySelector('#messages')

const messagetemplate = document.querySelector('#message-template').innerHTML
const locationmessagetemplate = document.querySelector('#locationmessage-template').innerHTML
const sidebartemplate = document.querySelector('#sidebar-template').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


const autoscroll = () => {
    //new message element
    // const $newmessage = $messages.lastElementChild

    // //height of new messages
    // const newmessagestyles = getComputedStyle($messages.lastElementChild)
    // const newmessagemargin = parseInt(newmessagestyles.marginBottom)
    // const newmessageheight = $newmessage.offsetHeight + newmessagemargin

    // //visible height: 
    // const visibleheight = $messages.offsetHeight

    // //height of message container
    // const containerheight = $messages.scrollHeight

    // //how far to scroll 
    // const scrolloffset = $messages.scrollTop + visibleheight

    // if (containerheight - newmessageheight <= scrolloffset) {
    //     $messages.scrollTop = $messages.scrollheight
    // }

}



socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messagetemplate, {
        message: message.text,
        username: message.username,
        createdat: moment(message.createdat).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforebegin', html)
    autoscroll()
})


socket.on('locationmessage', (url) => {
    console.log(url)
    const html = Mustache.render(locationmessagetemplate, {
        link: url.link,
        username: url.username,
        createdat: moment(url.createdat).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforebegin', html)
    autoscroll()
})

socket.on('roomdata', ({ room, users }) => {
    const html = Mustache.render(sidebartemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html

})


document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    $messageformbutton.setAttribute('disabled', 'disabled')
        //disable
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageformbutton.removeAttribute('disabled')
        $messageforminput.value = ''
        $messageforminput.focus()

        if (error) {
            return console.log(error)
        }
        console.log('The message is delivered')
    })

})

document.querySelector('#sendlocation').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('geolocation not supported ')
    }
    //sendlocationbutton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('sendlocation', {
            latitude: position.coords.latitude,
            logitude: position.coords.longitude
        }, () => {
            console.log('location shared ')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'

    }

})