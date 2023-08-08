const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];        //console.log(token);

        //console.log(token);
        const decoded = jwt.verify(token,config.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch(error){
        return res.status(401).json({
            errorMessage : 'Auth failed, please check your email and password'
        });
    }
}