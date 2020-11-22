const getIp = (req) => {
  // console.log('here is the request body ', req);

    return (req.headers['x-forwarded-for'] || '').split(',').pop().trim()
      || req.connection.remoteAddress
      || req.socket.remoteAddress
      || req.connection.socket.remoteAddress;
  }
  
  module.exports.getIp = getIp;
  