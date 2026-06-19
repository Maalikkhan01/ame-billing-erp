const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dns.resolveSrv(
  "_mongodb._tcp.am.ez5evbd.mongodb.net",
  (err, records) => {
    console.log(err);
    console.log(records);
  }
);