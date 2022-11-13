const express = require('express')
var axios = require('axios');
var getNFTs = require('./get-nfts')
var mintNFT = require('./mint-nft')

const app = express()
const hostname = '127.0.0.1';
const port = 3000
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static('public'))
app.use(express.json());
const cors = require("cors");
const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}

app.use(cors(corsOptions)) //

app.post("/upload", urlencodedParser, async (req, res) => {
  ipfs = await upload(req.body)
  console.log(ipfs)
  hash = await mintNFT.mintNFT(ipfs['IpfsHash'])
  console.log(hash)
});

app.post("/get-nfts", urlencodedParser, (req, res) => {
  getNFTs.getNFTs(req.body.account).then(data => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  })

});

async function upload(data) {
  var data = JSON.stringify({
    "pinataOptions": {
      "cidVersion": 1
    },
    "pinataMetadata": {
      "name": "testing",
      "keyvalues": {
      }
    },
    "pinataContent": data
  });

  var config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlODA2YTJlZi1hNzc1LTQyM2QtYTU1My1iN2YwMTcxODVhNjkiLCJlbWFpbCI6ImVsaXNhZmxlbWVyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjMGM2YmMyNDkwOWVjZTc4NDhlZCIsInNjb3BlZEtleVNlY3JldCI6IjM1NTg1YzljYmI4MGRhMzViZTUyMTg4YTY2ZGZkZGQ3YjkyM2Q1MjdiYjJjMmVlNzgxYTJlMDQ2MzgxZmM2ZWYiLCJpYXQiOjE2NjgzNTIyNjV9.hSlgIxUhmvxLZqd4nDYW_cM1dbczPelF6h8edncUJJo'
    },
    data: data
  };

  const res = await axios(config);

  return res.data;
}

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

