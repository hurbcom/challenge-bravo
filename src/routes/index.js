module.exports = {
    get: [
        {
            path: "/",
            callback: (req, res) => {
                res.send("API IS ONLINE");
            },
        },
        {
            path: "/conversion",
            callback: require("@controllers/convert-currency"),
        },
    ],
    post: [
        {
            path: "/coin",
            callback: require("@controllers/add-coin"),
        },
    ],
};
