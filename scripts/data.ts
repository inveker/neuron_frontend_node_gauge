// Entry point
async function main() {
  const data = (await import('../scripts/cache.json')).default
  console.log(`Data result: ${JSON.stringify(data, null, 4)}`)
}

// Execute script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
