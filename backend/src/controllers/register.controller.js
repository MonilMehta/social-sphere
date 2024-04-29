const usersDB = {
    users: require("../models/user.models"),
    setUsers: function (data) {
      this.users = data;
    },
  }
  const fsPromises = require("fs").promises;
  const path = require("path");
  const bcrypt = require("bcrypt");
  
  const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd)
      return res
        .status(400)
        .json({ message: "Username and password must be provided are required" });
    //check for duplicate username
    const duplicate = usersDB.users.find((person) => person.username === user);
    if (duplicate) return res.sendStatus(409);
    try {
      //hash password
      const hashedPwd = await bcrypt.hash(pwd, 10);
      //create new user
      const newUser = { username: user, password: hashedPwd };
      usersDB.setUsers([...usersDB.users, newUser]);
      //save to file
      await fsPromises.writeFile(
        path.join(__dirname, "..", "model", "users.json"),
        JSON.stringify(usersDB.users)
      );
      console.log(usersDB.users);
      res.status(201).json({'success':`New user ${user} create!`});
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  
  module.exports={handleNewUser};
  