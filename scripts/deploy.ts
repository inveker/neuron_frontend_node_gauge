import { writeFileSync } from 'fs'
import { deployments, ethers } from 'hardhat'
import { SUSHI_FACOTRY, SUSHI_ROUTER, WETH } from '../constants/addresses'
import {
  GaugesDistributor__factory,
  IUniswapRouterV2__factory,
  IUniswapV2Factory__factory,
  NeuronToken__factory,
} from '../typechain-types'

// Entry point
async function main() {
  // Signers
  const signers = await ethers.getSigners()
  const deployer = signers[0]
  const user = signers[1]

  console.log(`Deployer balance: ${await deployer.getBalance()}`);
  // Fixtures
  await deployments.fixture([
    'NeuronToken',
    'Axon',
    'MasterChef',
    'Controller',
    'GaugesDistributor',
    'GaugeImplementation',
  ])

  // Deployments
  const NeuronTokenDeployment = await deployments.get('NeuronToken')
  const AxonDeployment = await deployments.get('Axon')
  const MasterChefDeployment = await deployments.get('MasterChef')
  const ControllerDeployment = await deployments.get('Controller')
  const GaugesDistributorDeployment = await deployments.get('GaugesDistributor')
  const GaugeImplementationDeployment = await deployments.get('GaugeImplementation')

  // Contracts
  const neuronToken = NeuronToken__factory.connect(NeuronTokenDeployment.address, deployer)
  const gaugesDistributor = GaugesDistributor__factory.connect(GaugesDistributorDeployment.address, deployer)
  const sushiFactory = IUniswapV2Factory__factory.connect(SUSHI_FACOTRY, deployer)
  const sushiRouter = IUniswapRouterV2__factory.connect(SUSHI_ROUTER, deployer)

  // Create sushi pair
  await sushiFactory.createPair(WETH, NeuronTokenDeployment.address)
  const sushiPairAddress = await sushiFactory.getPair(WETH, NeuronTokenDeployment.address)

  // Add liqudity to sushi pair
  const neurAmount = ethers.utils.parseEther('100000')
  const ethAmount = neurAmount.div('1000')
  await neuronToken.mint(await deployer.getAddress(), neurAmount)
  await neuronToken.approve(SUSHI_ROUTER, neurAmount)
  await sushiRouter.addLiquidityETH(
    NeuronTokenDeployment.address,
    neurAmount,
    0,
    0,
    await user.getAddress(),
    (Date.now() / 1000).toFixed(0) + 60,
    { value: ethAmount }
  )

  // Create gauge
  await gaugesDistributor.addGauge(sushiPairAddress, GaugeImplementationDeployment.address)
  await gaugesDistributor.setWeights([sushiPairAddress], [ethers.BigNumber.from('100')])
  const gaugeAddress = await gaugesDistributor.getGauge(sushiPairAddress)

  await neuronToken.mint(gaugesDistributor.address, ethers.utils.parseEther('1000'))

  // Snapshot
  const initSnapshot = await ethers.provider.send('evm_snapshot', [])

  // Result
  const result = {
    neuronToken: NeuronTokenDeployment.address,
    axon: AxonDeployment.address,
    masterChef: MasterChefDeployment.address,
    controller: ControllerDeployment.address,
    gaugesDistributor: GaugesDistributorDeployment.address,
    gaugeImplementation: GaugeImplementationDeployment.address,
    sushiPair: sushiPairAddress,
    gauge: gaugeAddress,
    initSnapshot: initSnapshot,
  }
  console.log(`Deploy result: ${JSON.stringify(result)}`)

  // Save result to cache
  writeFileSync('./scripts/cache.json', JSON.stringify(result, null, 4))
}

// Execute script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
