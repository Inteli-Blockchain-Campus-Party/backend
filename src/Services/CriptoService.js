require('dotenv').config({path: __dirname + '/../../.env'});
const axios = require('axios')

const CryptoJS = require('crypto-js');

const Mooralis = require("moralis")
const Moralis = Mooralis.default;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(process.env.API_URL)

const { EvmChain } = require("@moralisweb3/evm-utils");
const APIError = require('./ErrorService');


class CriptoService {
    static formatNFTMetadata = (info, level) => {
        const date = new Date();
        const record = {
            "name": "Health Vault Data",
            "description": "Encrypted data. Use the key to this privacy level to unlock.",
            "image": level == 0 ? '' : level == 1 ? '' : level == 3 ? '' : '',
            "attributes": [
                {
                    "trait_type": "timestamp",
                    "value": date.getTime()
                },
                {
                    "trait_type": "privacy_level",
                    "value": level
                },
                {
                    "trait_type": "data",
                    "value": info
                }
            ]
        }
         return record
    }

    static upload = async (data) => {
        const pinataData = JSON.stringify({
          "pinataOptions": {
            "cidVersion": 1
          },
          "pinataMetadata": {
            "name": "HealthVault",
            "keyvalues": {
            }
          },
          "pinataContent": data
        });
      
        const res = await axios({
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.PINATA_TOKEN}`
            },
            data: pinataData
          });
      
        return res.data;
      }

      static encrypt = (jsonData, password) => {
        const string = JSON.stringify(jsonData);
        return CryptoJS.AES.encrypt(string, password).toString();
      }

    static decrypt = (encrypted, password) => {
        if(encrypted && password){
            return CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8);
        }
    }

    static getEncryptedDataFromMetadata = (json) => {
        return json.attributes.find(element => element.trait_type == 'data').value;
    }

    static getNFTs = async (desiredAddress) => {
        await Moralis.start({
            apiKey: process.env.MORALIS_TOKEN,
            // ...and any other configuration
        });
    
        const address = desiredAddress;
    
        const chain = EvmChain.GOERLI;
    
        const response = await Moralis.EvmApi.nft.getWalletNFTs({
            address,
            chain,
        });

        return response.data.result.filter(element => {
            const metadata = JSON.parse(element.metadata);

            if(metadata){
                return metadata.attributes.find(attribute => {
                    attribute.trait_type == 'data'
                })
            }

        }).map(element => {
            element.metadata = JSON.parse(element.metadata);
            return element;
        })
    }

    static mintNFT = async function(address, tokenURI) {
        const contract = require("../ethereum/contracts/Procedure.json")
        const nftContract = new web3.eth.Contract(contract.abi, process.env.CONTRACT_ADDRESS)
        const nonce = await web3.eth.getTransactionCount( process.env.PUBLIC_KEY, 'latest'); //get latest nonce
    
        //the transaction
        const tx = {
            'from':  process.env.PUBLIC_KEY,
            'to': process.env.CONTRACT_ADDRESS,
            'nonce': nonce,
            'gas': 500000,
            'data': nftContract.methods.mintNFT(address, tokenURI).encodeABI()
        };
    
        try {
            const signPromise = web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY)
            signPromise
                .then((signedTx) => {
                    web3.eth.sendSignedTransaction(
                        signedTx.rawTransaction,
                        function (err, hash) {
                            if (!err) {
                                console.log(
                                    "The hash of your transaction is: ",
                                    hash,
                                    "\nCheck Alchemy's Mempool to view the status of your transaction!"
                                )
                                return hash
                                    
                            } else {
                                console.log(
                                    "Something went wrong when submitting your transaction:",
                                    err
                                )
                            }
                        }
                    )
                })
                .catch((err) => {
                    console.log(" Promise failed:", err)
                })
        } catch (error) {
            throw new APIError("Insuficient gunds for gas", 403, String(error));
        }
        
    }

    static getNFT = async (desiredAddress, key) => {
        const nfts = await this.getNFTs(desiredAddress);
        return nfts.find(element => {
            return this.decrypt(element.metadata ? this.getEncryptedDataFromMetadata(element) : element.attributes[2].value, key)
        })
    }

    static getDecriptedDataFromNFT = (nftJson, key) => {
        if(nftJson){
            const data =this.decrypt(nftJson.metadata ? this.getEncryptedDataFromMetadata(nftJson) : nftJson.attributes[2].value, key);
            if(data){
                return JSON.parse(data);
            }
        }
    }
    
}

module.exports = CriptoService;