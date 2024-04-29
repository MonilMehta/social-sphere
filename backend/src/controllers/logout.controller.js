const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) {
      this.users = data;
    },
};
const fsPromise=require('fs').promises;
const path=require('path');

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt)
        return res.sendStatus(204);
    
    const refreshToken = cookies.jwt;
    //is refresh token in db
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser)
    {
        res.clearCookie('jwt',{httpOnly: true});
        return res.sendStatus(204);
    }
    
    //remove refresh token from db
    const OtherUsers=usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser={...foundUser,refreshToken:''};
    usersDB.setUsers([...OtherUsers,currentUser]);
    await fsPromise.writeFile(
        path.join(__dirname, '..','model','users.json'),
        JSON.stringify(usersDB.users)
    );
        res.clearCookie('jwt',{httpOnly: true});
        res.sendStatus(204);
}
module.exports = {
    handleLogout
};
