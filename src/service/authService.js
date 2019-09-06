const jwt = require('jsonwebtoken');

exports.authenticate = async(req, res) => {
    //Simulation for  user new token
    const user = { id: 3 };
    const token = jwt.sign({ user: user.id }, "secret_key");
    res.status(200).json({
      token: token
    });
  };

exports.isAuthenticated = function (req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
  
      jwt.verify(req.token, "secret_key", function(err, data) {
        if (err) {
          res.status(401).json({ error: "Not Authorized" });
          throw new Error("Not Authorized");
        }
        return next();
      });
    } else {
      res.status(401).json({ error: "Not Authorized" });
      throw new Error("Not Authorized");
    }
  };
