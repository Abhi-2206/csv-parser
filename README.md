# csvParser

A lightweight CSV parser built from scratch using **Node.js**.

The goal of this project is to understand how CSV parsing works internally and build a reusable CSV parsing package without depending on an existing CSV parsing library.

> **Current status:** Version 1 — Initial working implementation
> This README is currently for project/instructor review. The final npm documentation will be prepared separately before publishing.

---

## About the Project

`csvParser` takes the path of a CSV file, reads the file, parses its contents, and converts the CSV data into an array of JavaScript objects.

For example, given:

```csv
name,age,city
Rahul,20,Pune
Aman,21,Mumbai
```

the parser produces:

```js
[
  {
    name: "Rahul",
    age: "20",
    city: "Pune"
  },
  {
    name: "Aman",
    age: "21",
    city: "Mumbai"
  }
]
```

---

## Why I Built This

The project was created to understand the internal process of CSV parsing instead of simply using an existing CSV parsing package.

The main concepts explored while building it are:

* Node.js file system operations
* Asynchronous file handling
* File size detection
* File streams
* Stream chunks
* Buffering incomplete rows
* CSV row parsing
* Handling commas inside quoted values
* Converting CSV rows into JavaScript objects
* Creating a reusable CommonJS module

---

## Technologies Used

### Node.js

The project is built using Node.js.

### JavaScript

The complete parsing logic is implemented using JavaScript.

### Node.js `fs` Module

The built-in `fs` module is used for file operations.

Currently, the project uses:

```js
fs.promises.stat()
fs.promises.readFile()
fs.createReadStream()
```

No external CSV parsing library is being used.

---

## How It Works

The parser receives a CSV file path:

```js
const data = await csvParser("./test.csv");
```

It first checks the size of the file.

```js
const fileSize = (await fs.promises.stat(filePath)).size;
```

The current implementation uses **100 MiB** as the threshold for deciding how the file should be processed.

### Processing Flow

```text
                    CSV File
                       │
                       ▼
                 Check file size
                       │
             ┌─────────┴─────────┐
             │                   │
          < 100 MiB          >= 100 MiB
             │                   │
             ▼                   ▼
      readFile()          createReadStream()
             │                   │
             ▼                   ▼
       Parse rows          Process chunks
             │                   │
             │              Buffer incomplete
             │                 rows
             │                   │
             └─────────┬─────────┘
                       ▼
                  Parse CSV rows
                       │
                       ▼
                First row = Header
                       │
                       ▼
             Convert rows to objects
                       │
                       ▼
                  Return data
```

---

## Small File Processing

For files smaller than 100 MiB, the complete file is read using:

```js
const data = await fs.promises.readFile(filePath, "utf-8");
```

The file is then divided into rows:

```js
let splitData = data.split("\n");
```

Each row is parsed individually.

The first row is treated as the header.

For example:

```csv
name,age,city
Rahul,20,Pune
Aman,21,Mumbai
```

The header is:

```js
["name", "age", "city"]
```

The remaining rows are converted into objects using these header names.

---

## Large File Processing

For files greater than or equal to 100 MiB, the parser uses:

```js
fs.createReadStream()
```

This allows the file to be processed as a sequence of chunks rather than reading the entire file at once.

A chunk does not necessarily end exactly at the end of a CSV row.

For example:

```text
Chunk 1:
Rahul,20,P

Chunk 2:
une
Aman,21,Mumbai
```

The first chunk contains an incomplete row.

To handle this, the parser maintains a buffer:

```js
let buffer = "";
```

Each chunk is added to the buffer:

```js
buffer += chunk;
```

The buffer is split into rows:

```js
let rows = buffer.split("\n");
```

The last element is kept in the buffer because it may be an incomplete row:

```js
buffer = rows.pop();
```

The complete rows can then be parsed safely.

This allows the parser to handle rows that are split across multiple stream chunks.

---

## CSV Row Parsing

The parser contains its own `parseRow()` function.

A simple approach such as:

```js
row.split(",");
```

does not work correctly when a CSV field contains a comma.

For example:

```csv
name,city
Rahul,"New Delhi, India"
```

The comma inside `"New Delhi, India"` should not create another column.

To handle this, the parser maintains an `insideQuotes` state:

```js
let insideQuotes = false;
```

When a quotation mark is encountered, the state changes.

A comma is considered a separator only when the parser is **not currently inside quotes**.

Therefore:

```csv
"New Delhi, India"
```

is treated as one field.

---

## Converting CSV Data to Objects

The first CSV row is used as the header.

For example:

```csv
name,age,city
Rahul,20,Pune
Aman,21,Mumbai
```

The header is:

```js
["name", "age", "city"]
```

The first data row is:

```js
["Rahul", "20", "Pune"]
```

It is converted into:

```js
{
  name: "Rahul",
  age: "20",
  city: "Pune"
}
```

The final result is an array of objects.

---

## Current Module Structure

The parser is exported from `main.js`:

```js
module.exports = csvParser;
```

During local development, it can be imported using:

```js
const csvParser = require("./main");
```

This allows the parser to be tested independently from the implementation file.

---

## Current Testing

A `test.js` file is currently being used to test the parser during development.

Example:

```js
const csvParser = require("./main");

async function test() {
  const data = await csvParser("./test.csv");

  console.log(data);
}

test();
```

The test file is currently part of the development process and its final role in the published npm package will be decided later.

---

## Current Version 1 Features

The current implementation supports:

* [x] Accepting a CSV file path
* [x] Checking file size
* [x] Reading small files asynchronously
* [x] Reading large files using streams
* [x] Handling chunks split in the middle of a row
* [x] Buffering incomplete rows
* [x] Using the first row as the header
* [x] Converting CSV rows into JavaScript objects
* [x] Handling commas inside quoted values
* [x] Exporting the parser as a reusable CommonJS module

---

## Current Development Status

`csvParser` is currently at its **initial working implementation**.

The core parsing logic has been implemented and tested with both small and large CSV files.

Future development will focus on improving the package before npm publication, including areas such as:

* Better error handling
* More comprehensive CSV edge-case support
* Testing strategy
* Package configuration
* API improvements
* npm package documentation
* Publishing preparation

These features will be added incrementally as the project develops.

---

## Project Goal

The final goal is to turn this project into a reusable npm package called:

```text
csvParser
```

so that developers can install the package and use the parser directly in their Node.js applications.
