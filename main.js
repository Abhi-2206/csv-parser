const fs = require('fs')
const path = require('path')

function csvParser() {

    const filePath = path.join(__dirname, 'test.csv')

    const data = fs.readFileSync(filePath, 'utf-8')

    function parseRow(row) {
        let result = []
        let currentValue = ""
        let insideQuotes = false

        for (let i = 0; i < row.length; i++) {
            let char = row[i]

            if (char === '"') {
                insideQuotes = !insideQuotes
            }
            else if (char === ',' && !insideQuotes) {
                result.push(currentValue)
                currentValue = ""
            }
            else {
                currentValue += char
            }
        }

        result.push(currentValue)

        return result
    }

    let splitData = data.split('\n')

    let parsedData = []

    for (let row of splitData) {
        parsedData.push(parseRow(row))
    }

    const header = parsedData[0]

    parsedData.shift()

    let finalData = []

    for (let i = 0; i < parsedData.length; i++) {
        let obj = {}

        for (let j = 0; j < header.length; j++) {
            obj[header[j]] = parsedData[i][j]
        }

        finalData.push(obj)
    }

    return finalData
}

console.log(csvParser())