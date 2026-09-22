const fs = require('fs')
const path = require('path')

function csvParser() {

    const filePath = path.join(__dirname, 'test.csv')

    const data = fs.readFileSync(filePath, 'utf-8')

    let splitData = data.split('\n')

    let parsedData = []

    for (let row of splitData) {
        parsedData.push(row.split(','))
    }

    console.log(parsedData)
}

csvParser()