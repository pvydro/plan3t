#! /usr/bin/env node
const fs = require('fs')
const path = require('path')

var getDirectories = (rootdir , cb) => {
    fs.readdir(rootdir, (err, files) => {
        if(err) throw err

        var dirs = files.map(filename => path.join(rootdir,filename)).filter( pathname => fs.statSync(pathname).isDirectory())

        return cb(dirs)
    })
}

function fetchDecorationKeys() {
    console.log('Fetching decoration keys')

    const decorationPaths = []
    const mapsDir = 'assets/image/gamemap/mapbuilding/'
    const keysFile = 'src/json/BiomeDecorations.json'


    getDirectories(mapsDir, (allMaps) => {
        console.log('Collected map directories')
        console.log(allMaps)

        allMaps.forEach((dir) => {
            const decorationDir = path.join(dir, '/decorations')

            if (decorationDir) {
                console.log(`Iterated MapBuilding directory: ${dir}`)
                fs.readdir(decorationDir, (error, files) => {

                    if (error) {
                        console.log(`No decorations for ${dir}`)
                    } else if (files) {
                        for (var i in files) {
                            
                            const fileName = files[i]

                            if (fileName.includes('.png')) {
                                const filePath = `${decorationDir}/${fileName}`.replace('.png', '')
        
                                console.log(`Iterated file: ${filePath}`)
                    
                                decorationPaths.push(filePath)
                            }
                        }
                    }
                    
                    fs.writeFileSync(keysFile, JSON.stringify(decorationPaths))
                })
            }
        })
    })
}

function fetchAttachmentKeys() {
    console.log('Fetching attachment keys')

    const attachmentsDir = 'assets/image/weapons/attachments'

    getDirectories(attachmentsDir, (allAttachments) => {
        console.log('Collected attachment directories')
        console.log(allAttachments)

        const attachmentPaths = []

        allAttachments.forEach((dir) => {
            const attachmentDir = path.join(dir, '/')

            if (attachmentDir) {
                console.log(`Iterated Attachment directory: ${dir}`)
                fs.readdir(attachmentDir, (error, files) => {

                    if (error) {
                        console.log(`No attachments for ${dir}`)
                    } else if (files) {
                        for (var i in files) {
                            
                            const fileName = files[i]

                            if (fileName.includes('.png')) {
                                const filePath = `${attachmentDir}${fileName}`.replace('.png', '')
        
                                console.log(`Iterated file: ${filePath}`)
                    
                                attachmentPaths.push(filePath)
                            }
                        }
                    }
                    
                    fs.writeFileSync('src/json/AttachmentKeys.json', JSON.stringify(attachmentPaths))
                })
            }
        })
    })
}

fetchDecorationKeys()
fetchAttachmentKeys()
