const csvParser = require('./main.js')

async function test() {
  const data = await csvParser('./test.csv')
  console.log(data)
}

test()
