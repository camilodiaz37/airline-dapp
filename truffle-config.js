const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");

const mnemonic = "scorpion reopen wash frozen caught decrease turtle offer dolphin early chef tonight"

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host:'localhost',
      port: 8545 ,
      network_id:'*',
      gas:5000000
    },
    rapsten: {
      provider: () => new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/67e1b5e4e1fb401ea6e8c8659446d6d7"),
      network_id:3,

    }
  }
};
