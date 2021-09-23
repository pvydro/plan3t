#! /usr/bin/env node
const fs = require('fs')

function fetchDecorationKeys() {
    console.log('Fetching decoration keys')

    const decorationPaths = []
    let decorationDir = 'assets/image/gamemap/mapbuilding/dojo/decorations'
    const keysFile = 'src/json/BiomeDecorations.json'


    fs.readdir(decorationDir, (error, files) => {

        for (var i in files) {
            const fileName = files[i]
            const filePath = `${decorationDir}/${fileName}`

            decorationPaths.push(filePath)
        }

        fs.writeFileSync(keysFile, JSON.stringify(decorationPaths))
        // console.log(decorationPaths)
    })
}

// function writeToFile(file, data) {
//     fs.writeFile(file, data)
// }

fetchDecorationKeys()

