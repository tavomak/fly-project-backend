const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  // console.log('From UserController', req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  let type = req.body.type;

  try {
    // Revisar que ek usuario sea unico
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already in use" });
    }
    if (!type) {
      type = 'gess';
    }

    const enumType = ['gess','user','admin', 'super_admin'];

    const userType = enumType.some((item) => item === type);

    if (!userType) {
      return res.status(400).json({ msg: "User type does´nt alowed" });
    }
    // crear usuario
    user = new User(req.body);

    // Hashear pass
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);
    // guardar usuario
    await user.save();

    // Crear JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Firmar JWT
    jwt.sign(
      payload,
      process.env.SECRET,
      { expiresIn: "24h" },
      (error, token) => {
        if (error) {
          throw new Error(error);
        }

        // mensaje de confirmaci'on
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Opps, an error has occured" });
  }
};
