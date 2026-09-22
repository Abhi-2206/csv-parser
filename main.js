const fs = require('fs')
const path = require('path')

function csvParser() {

    const filePath = path.join(__dirname, 'test.csv')

    const data = fs.readFileSync(filePath, 'utf-8')

    console.log(data)
}

csvParser()