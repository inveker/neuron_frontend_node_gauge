import { network } from 'hardhat'

// Entry point
async function main() {
  const week = 60 * 60 * 24 * 7
  await network.provider.send('evm_increaseTime', [week])
  await network.provider.send('evm_mine')
}

// Execute script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
