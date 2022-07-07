import { ethers } from 'hardhat'
import CACHE from './cache.json'

// Entry point
async function main() {
  await ethers.provider.send('evm_revert', [CACHE.initSnapshot])
}

// Execute script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
