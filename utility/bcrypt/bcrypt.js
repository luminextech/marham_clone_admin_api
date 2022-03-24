const bcrypt = require("bcrypt");

const encryption = async (key,saltValue=10)=>{
    return await bcrypt.hash(key,saltValue);
}

const compare = async (requestedPass,encryptedPass)=>{
    return await bcrypt.compare(requestedPass,encryptedPass);
}


module.exports = {
    encryption,
    compare
}