const Account = require("../models/Account");
const { validationResult } = require("express-validator");

exports.createAccount = async (req, res) => {
  const { name } = req.body;
  let account = await Account.findOne({ name });

  if (account) {
    return res.status(400).json({ msg: "Account already in use" });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const account = new Account(req.body);

    account.owner = req.user.id;
    account.members = req.user.id;

    account.save();
    res.json(account);
  } catch (error) {
    console.log(error);
    res.status(500).send("Opps, an error has occured");
  }
};

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json({ accounts });
  } catch (error) {
    console.log(error);
    res.status(500).send("Opps, an error has occured");
  }
};

exports.updateAccount = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, members } = req.body;
  const newAccount = {};

  if (name) {
    newAccount.name = name;
  }

  if (members) {
    newAccount.members = members;
  }

  try {
    // Revisar el Id
    let account = await Account.findById(req.params.id);

    // Si el proyecto existe
    if (!account) {
      return res.status(404).json({ msg: "Account has not found" });
    }
    // Verificar el creador
    if (account.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User unauthorized" });
    }
    // Actualizar
    account = await Account.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: newAccount },
      { new: true }
    );

    res.json({ account });
  } catch (error) {
    console.log(error);
    res.status(500).send("Opps, an error has occured");
  }
};

exports.removeAccount = async (req, res) => {
  try {
    // Revisar el Id
    // console.log(req.params.id);
    let account = await Account.findById(req.params.id);

    // Si el proyecto existe
    if (!account) {
      return res.status(404).json({ msg: "Account has not found" });
    }

    // Verificar el creador
    if (account.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User unauthorized" });
    }

    // Eliminar cuenta
    await Account.findByIdAndRemove({ _id: req.params.id });

    res.json({ msg: "Account removed" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Opps, an error has occured");
  }
};
