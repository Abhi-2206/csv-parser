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

    const header = parsedData.shift()

    let finalData = []

    for (let i = 0; i < parsedData.length; i++) {
        let obj = {}

        for (let j = 0; j < header.length; j++) {
            obj[header[j]] = parsedData[i][j]
        }

        finalData.push(obj)
    }

    console.log(finalData)
}

csvParser()