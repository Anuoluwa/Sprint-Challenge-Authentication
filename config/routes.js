const axios = require('axios');
const bcrypt = require('bcryptjs');

const { authenticate } = require('../auth/authenticate');
const { hashPassword } = require('../utils/passwordHelper');
const { generateToken } = require('../utils/generateToken');
const User = require('../database/auth-model');


module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};


function register(req, res) {
  // implement user registration
  let { username, password: pwd } = req.body;
  let password = hashPassword(pwd);
  const user = {
    username,
    password
  };
  User.insert(user)
    .then(data => {
      return res
        .status(201)
        .json({ message: "user  created successfully", data: user });
    })
    .catch(error => {
      if (error.code.includes("SQLITE_CONSTRAINT")) {
        return res.status(409).json({
          status: 409,
          error: "user cannot be registered twice"
        });
      } else {
        return res
          .status(500)
          .json({ error: "The users information could not be created." });
      }
    })
}

async function login(req, res) {
  // implement user login
  let { username, password: pwd } = req.body;
  const validUser = await User.getByUsername(username);
  let validPassword = validUser.password;
  let user = {
      sub: validUser.id,
      username: validUser.username
  }

  try {
    const comparePassword = await bcrypt.compareSync(pwd, validPassword);
    
    if (validUser && comparePassword) {
    const token = generateToken(validUser);      
    return res.status(200).json({ message: `Welcome ${validUser.username}!, login successful`, token  });
    } else {
      return res.status(400).json({ message: "wrong email or password, login not successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "The users information could not be retrieved." });
  }
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
