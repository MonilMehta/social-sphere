const usersDB = {
    users: require("../models/user.models"),
    setUsers: function (data) {
      this.users = data;
    },
};

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt)
        return res.sendStatus(401);
    
    const refreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser)
        return res.sendStatus(403); // Changed to 403 for unauthorized
    
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username)
                return res.sendStatus(403);

            console.log(foundUser); // Changed from user to foundUser
            const accessToken = jwt.sign(
                { "username": decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "30s" } // Adjust expiry time as needed
            );
            res.json({ accessToken });
        }
    );
};

module.exports = {
    handleRefreshToken
};
