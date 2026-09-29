const fs = require("fs");

async function csvParser(filePath) {

  const fileSize = (await fs.promises.stat(filePath)).size;


  if (fileSize >= 100 * 1024 * 1024) {

    return new Promise((res,rej)=>{

      let buffer = ""
      let header = null
      let finalData = []

      const stream = fs.createReadStream(filePath,'utf-8')
      stream.on('data',(chunk)=>{
        buffer+=chunk

        let rows = buffer.split('\n')
        buffer = rows.pop()

        for(let row of rows){
          let parsedRow = parseRow(row)

          if(header === null){
            header = parsedRow
            continue
          }

          let obj = {}

          for(let j = 0;j<header.length;j++){

            obj[header[j]] = parsedRow[j]
          }
          finalData.push(obj)

        }
      })

      stream.on('end',()=>{
        res(finalData)
      })

      stream.on('error',(err)=>{
        rej(err)
      })
    })



  } else {
    const data = await fs.promises.readFile(filePath, "utf-8");
    let splitData = data.split("\n");

    let parsedData = [];

    for (let row of splitData) {
      parsedData.push(parseRow(row));
    }

    const header = parsedData[0];

    parsedData.shift();

    let finalData = [];

    for (let i = 0; i < parsedData.length; i++) {
      let obj = {};

      for (let j = 0; j < header.length; j++) {
        obj[header[j]] = parsedData[i][j];
      }

      finalData.push(obj);
    }

    return finalData;
  }

  function parseRow(row) {
    let result = [];
    let currentValue = "";
    let insideQuotes = false;

    for (let i = 0; i < row.length; i++) {
      let char = row[i];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        result.push(currentValue);
        currentValue = "";
      } else {
        currentValue += char;
      }
    }

    result.push(currentValue);

    return result;
  }
}


module.exports = csvParser
