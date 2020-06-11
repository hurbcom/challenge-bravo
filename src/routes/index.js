module.exports =  {
    get: [
        {
            path: '/',
            callback: (req, res) => {
                res.send ("API IS ONLINE")
            },
            path:'/get-conversion',
            callback: require('@controllers/convert-currency')
        }
    ]

}