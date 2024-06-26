const User = require("../models/user");
const TokenGenerator = require("../lib/token_generator");
const bcrypt = require("bcrypt");

const AuthenticationController = {
  Authenticate: async (req, res) => {
    console.log('Attempting Log in!')
    const email = req.body.email;
    const password = req.body.password;
    console.log('email',email)
    console.log('password',password)

    try {
      const user = await User.findOne({ email: email }).collation({ locale: 'en', strength: 2 });

      if (!user) {
        console.log('No User Found')
        return res.status(401).json({ message: "Email address not recognised" });
      }
      console.log(user)
      const PasswordMatch = await bcrypt.compare(password, user.password);
      if (!PasswordMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      const token = TokenGenerator.jsonwebtoken(user.id);
      return res.status(201).json({ token: token, message: "OK" });

    } 
    catch (error) {
      console.error('Error during authentication:', error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }
};

module.exports = AuthenticationController;