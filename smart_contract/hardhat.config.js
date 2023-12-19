// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.17",
// };

// https://eth-goerli.g.alchemy.com/v2/SLVMGBtN1c8xN3UZIOWhvPo-ld-QKr2n

require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: "0.8.0",
  networks:{
    Ganache:{
      url: "http://127.0.0.1:7545",
      accounts: ['9059145e2df246d19b690f34b02253e69655680bc2d29f97b7a712a596d29826']
    }
  }
}