// Import the NFTStorage class and File constructor from the 'nft.storage' package
const { NFTStorage, File } = require('nft.storage')

const fs = require('fs')

// The 'mime' npm package helps us set the correct file type on our File objects
const mime = require('mime')

// The 'path' module provides helpers for manipulating filesystem paths
const path = require('path')

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY

async function storeNFT(file, name, description) {
    
    // Create file object
    let image = null
    if (file) {
        image = new File([file.buffer], file.originalname, { type: file.mimetype })
    } else {
        image = await fileFromPath(__dirname + '/../../images/lectureNftDefault.png')
    }

    // create a new NFTStorage client using our API key
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

    // call client.store, passing in the image & metadata
    return await nftstorage.store({
        image,
        name,
        description,
    })
}

async function fileFromPath(filePath) {
    const content = await fs.promises.readFile(filePath)
    const type = mime.getType(filePath)
    return new File([content], path.basename(filePath), { type })
}

module.exports = {
    storeNFT,
}
