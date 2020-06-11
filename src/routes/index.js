module.exports =  {
    get: [
        {
            path: '/',
            callback: (req, res) => {
                res.send ("API IS ONLINE")
            }
        }
    ]

}