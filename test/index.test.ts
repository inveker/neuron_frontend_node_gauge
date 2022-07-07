import axios from 'axios'
import { Wallet } from 'ethers'
import { ethers } from 'hardhat'
import CONFIG from '../config.json'
import { GaugeImplementation__factory, NeuronToken__factory } from '../typechain-types'
import { IERC20__factory } from '../typechain-types/factories/contracts/lib/AnyswapV5ERC20.sol'
import WALLETS from '../assets/wallets.json'
import { assert } from 'console'

const LOCAL_HOST = `http://127.0.0.1:${CONFIG.serverPort}`

describe('Server tests', () => {
  it('Regular test', async () => {
    const initResponse = await axios.post(`${LOCAL_HOST}/init/`)

    const provider = new ethers.providers.JsonRpcProvider(initResponse.data.host)

    const deployer = new Wallet(WALLETS[0], provider)
    const user = new Wallet(WALLETS[1], provider)

    const initUserBalance = await user.getBalance()

    const result = JSON.parse(initResponse.data.result)

    const neuronToken = NeuronToken__factory.connect(result.neuronToken, user)
    const sushiLpToken = IERC20__factory.connect(result.sushiPair, user)
    const gauge = GaugeImplementation__factory.connect(result.gauge, user)

    const lpBalance = await sushiLpToken.balanceOf(await user.getAddress())

    await sushiLpToken.approve(gauge.address, lpBalance)
    await gauge.deposit(lpBalance)

    const distributeResponse = await axios.post(`${LOCAL_HOST}/distribute/`)

    const timeResponse = await axios.post(`${LOCAL_HOST}/time/`)

    const initialBalance = await neuronToken.balanceOf(await user.getAddress())

    await gauge.connect(user).getReward()

    const resultBalance = (await neuronToken.balanceOf(await user.getAddress())).sub(initialBalance)

    const resultUserBalance = await user.getBalance()

    const resetResponse = await axios.post(`${LOCAL_HOST}/reset/`)

    const resetUserBalance = await user.getBalance()

    assert(resultBalance.gt(0))
    assert(resultUserBalance.lt(initUserBalance))
    assert(initUserBalance.eq(resetUserBalance))
  })
})
