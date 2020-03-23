const generatemessage = (username, text) => {
    return {
        text,
        username,
        createdat: new Date().getTime()
    }
}

const generatelocationmessage = (username, url) => {
    return {
        username,
        url,
        createdat: new Date().getTime()
    }
}

module.exports = {
    generatemessage,
    generatelocationmessage
}