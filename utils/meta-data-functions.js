function generateUserStamp(req){
  console.log("edit by", req.connection.remoteAddress);
  return {
    name: "not-yet-implemented",
    "ip-address": req.connection.remoteAddress
  }
}

module.exports = {
  generateUserStamp
}
