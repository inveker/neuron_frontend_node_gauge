import { ethers } from 'hardhat'
import { GaugesDistributor__factory } from '../typechain-types'
import CACHE from './cache.json'

// Entry point
async function main() {
  // Signers
  const signers = await ethers.getSigners()
  const deployer = signers[0]

  console.log(`Deployer balance: ${await deployer.getBalance()}`);
  // Contracts
  const gaugesDistributor = GaugesDistributor__factory.connect(CACHE.gaugesDistributor, deployer)

  // Logic
  const week = 60 * 60 * 24 * 7
  await gaugesDistributor.distribute(week)
}

// Execute script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
