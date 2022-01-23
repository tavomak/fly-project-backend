const Account = require("../models/Account");
 
module.exports = async function(req, res, next) {
  const access = req.body.account;
  const currentUser = req.user.id;

  if(!access || access.length != 24) {
    return res.status(401).json({msg: "Access doesn't exist"})
  }
  
  const account = await Account.findById(access);

  if(!account) {
    return res.status(401).json({msg: "Account doesn't exist"})
  }

  const hasAccess = account.members.some((item) => item.toString() === currentUser);

  if(!hasAccess) {
    return res.status(401).json({msg: "you don't have permission to access this resource"})
  }

  try {
    req.currentUser = access;
    next();
  } catch (error) {
    res.status(401).json({msg: 'Invalid User'})
  }
}