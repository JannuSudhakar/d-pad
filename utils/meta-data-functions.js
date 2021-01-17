function generateUserStamp(req){
  return {
    name: "not-yet-implemented",
    "ip-address": req.connection.remoteAddress
  }
}

module.exports = {
  generateUserStamp
}
