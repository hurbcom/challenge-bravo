module.exports =  {
    get: [
        {
            path: '/',
            callback: (req, res) => {
                res.send ("API IS ONLINE")
            },
            path:'/conversion',
            callback: require('@controllers/convert-currency')
        }
    ]

}