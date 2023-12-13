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
      accounts: ['0x24b195fd8ca7c07d6c31c24e0d1caa772b985bf147eff1e16ffdecff8f61ff4a']
    }
  }
}