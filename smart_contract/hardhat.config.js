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
      accounts: ['f9603bf8aaccc3002084d9a8c5e13f901cbe963ff78779102569dfd61d2490c0']
    }
  }
}