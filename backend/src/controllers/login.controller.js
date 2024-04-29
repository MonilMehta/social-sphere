const usersDB = {
    users: require("../models/user.models"),
    setUsers: function (data) {
      this.users = data;
    },
}
const path=require('path');
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');
require('dotenv').config();
const fsPromises=require('fs').promises;


const handleLogin= async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd)
        return res
        .status(400)
        .json({ message: "Username and password must be provided are required" });
    const foundUser=usersDB.users.find(person => person.username === user);
    console.log("got");
    if (!foundUser) return res.status(401);//unauthorized
    const match = await bcrypt.compare(pwd, foundUser.password);
    
    if(match){
        //create JWT object
        const accessToken=jwt.sign(
            {"username":foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:"30s"
            }  
        );
        const refreshToken=jwt.sign(
            {"username":foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn:"1d"
            }  
        );
        //saving refreshtoken with current user
        const otherUsers=usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser={...foundUser,refreshToken};
        usersDB.setUsers([...otherUsers,currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname,"..","model","users.json"),
            JSON.stringify(usersDB.users)
        )
        //
        res.cookie('jwt',refreshToken,{httpOnly: true, maxAge:24*60*60*1000});
        res.json({accessToken});
    }  
    else{
        res.status(401)
    }
}

module.exports = {
    handleLogin
}