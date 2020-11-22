const generateLoginToken = () => {
   const loginToken = Math.floor(100000 + Math.random() * 900000);
    
    // Set expire
  const loginTokenExpire = Date.now() + 30 * 60 * 1000;
}


module.exports.generateLoginToken = generateLoginToken;
