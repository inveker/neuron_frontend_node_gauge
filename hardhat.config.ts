import CONFIG from './config.json'

import WALLETS from './assets/wallets.json'

import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-vyper'
import 'hardhat-deploy-ethers'
import 'hardhat-deploy'
import '@nomiclabs/hardhat-web3'
import 'hardhat-abi-exporter'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import '@nomiclabs/hardhat-etherscan'

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  abiExporter: {
    path: './assets/abi',
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: CONFIG.forkRpc,
      },
      loggingEnabled: true,
      blockGasLimit: 0x1fffffffffffff,
      accounts: getHardhatAccounts(20),
      gas: 120e9,
    },
  },
  vyper: {
    version: '0.2.12',
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    timeout: 300000,
  },
}

function getHardhatAccounts(accountsNumber: number) {
  return WALLETS.map(x => {
    const A_LOT_OF_ETH = '100000000000000000000000000000000000000000'
    return {
      privateKey: x,
      balance: A_LOT_OF_ETH,
    }
  })
}

export default config
