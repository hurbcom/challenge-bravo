module.exports = {
    get: [
        {
            path: "/",
            callback: (req, res) => {
                res.send("API IS ONLINE");
            },
        },
        {
            path: "/coins",
            callback: require("@controllers/list-coins"),
        },
        {
            path: "/coin/conversion",
            callback: require("@controllers/convert-currency"),
        },
    ],
    post: [
        {
            path: "/coin",
            callback: require("@controllers/add-coin"),
        },
    ],
    delete: [
        {
            path: "/coin/:id",
            callback: require("@controllers/delete-coin"),
        },
    ],
    put: [
        {
            path: "/coin",
            callback: require("@controllers/update-coin"),
        },
    ],
};
