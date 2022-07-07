import express from 'express'
import cors from 'cors'
import CONFIG from '../config.json'
import { killPortProcess } from 'kill-port-process'
import { execute } from './utils'

const app = express()
app.use(cors())
const port = CONFIG.serverPort

app.post('/init', async (req, res) => {
  await killPortProcess(8545)

  async function initNode(): Promise<string> {
    return await new Promise<string>(resolve => {
      const process = execute('npx hardhat node')

      process.stdout.on('data', async data => {
        console.log(`node stdout: ${data}`)
        const find = 'Started HTTP and WebSocket JSON-RPC server at '
        if (data.includes(find)) {
          const host = `${data}`.replace(find, '').replace('\n', '')
          resolve(host)
        }
      })

      process.stderr.on('data', data => {
        console.log(`node stderr: ${data}`)
      })

      process.on('error', error => {
        console.log(`node error: ${error.message}`)
      })

      process.on('close', code => {
        console.log(`node child process exited with code ${code}`)
      })
    })
  }

  async function deploy(): Promise<string> {
    return await new Promise<string>(resolve => {
      const process = execute('npx hardhat run ./scripts/deploy.ts --network localhost')

      process.stdout.on('data', data => {
        console.log(`deploy stdout: ${data}`)
        const find = 'Deploy result: '
        if (data.includes(find)) {
          const result = `${data}`.replace(find, '')
          resolve(result)
        }
      })

      process.stderr.on('data', data => {
        console.log(`deploy stderr: ${data}`)
      })

      process.on('error', error => {
        console.log(`deploy error: ${error.message}`)
      })

      process.on('close', code => {
        console.log(`deploy child process exited with code ${code}`)
      })
    })
  }

  const host = await initNode()
  const result = await deploy()

  res.status(200).send({
    host,
    result,
  })
})

app.post('/distribute', async (req, res) => {
  await new Promise<void>(resolve => {
    const process = execute('npx hardhat run ./scripts/distribute.ts --network localhost')

    process.stdout.on('data', data => {
      console.log(`distribute stdout: ${data}`)
    })

    process.stderr.on('data', data => {
      console.log(`distribute stderr: ${data}`)
    })

    process.on('error', error => {
      console.log(`distribute error: ${error.message}`)
    })

    process.on('close', code => {
      console.log(`distribute child process exited with code ${code}`)
      resolve()
    })
  })
  res.status(200).send()
})

app.post('/time', async (req, res) => {
  await new Promise<void>(resolve => {
    const process = execute('npx hardhat run ./scripts/time.ts --network localhost')

    process.stdout.on('data', data => {
      console.log(`time stdout: ${data}`)
    })

    process.stderr.on('data', data => {
      console.log(`time stderr: ${data}`)
    })

    process.on('error', error => {
      console.log(`time error: ${error.message}`)
    })

    process.on('close', code => {
      console.log(`time child process exited with code ${code}`)
      resolve()
    })
  })
  res.status(200).send()
})

app.post('/reset', async (req, res) => {
  await new Promise<void>(resolve => {
    const process = execute('npx hardhat run ./scripts/reset.ts --network localhost')

    process.stdout.on('data', data => {
      console.log(`reset stdout: ${data}`)
    })

    process.stderr.on('data', data => {
      console.log(`reset stderr: ${data}`)
    })

    process.on('error', error => {
      console.log(`reset error: ${error.message}`)
    })

    process.on('close', code => {
      console.log(`reset child process exited with code ${code}`)
      resolve()
    })
  })
  res.status(200).send()
})

app.listen(port, () => console.log(`Server running on port ${port}`))
