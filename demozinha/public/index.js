function getUploadData() {
    console.log("im here")
    let diseaseInput = document.querySelector("#disease").value;
    console.log("input: " + diseaseInput)
    let jsonData = {
        disease: diseaseInput,
    }
    encrypted = encrypt(jsonData);
    fetch("http://127.0.0.1:3000/upload", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: encrypted })
    });


}

function encrypt(jsonData) {
    string = JSON.stringify(jsonData);
    return CryptoJS.AES.encrypt(string, document.querySelector("#password").value).toString();
}

function decrypt(encrypted) {
    return JSON.parse(CryptoJS.AES.decrypt(encrypted, document.querySelector("#password").value).toString(CryptoJS.enc.Utf8))
}

function fetchData() {
    let ipfs = document.querySelector("#ipfs").value
    let link = "https://ipfs.io/ipfs/" + ipfs
    console.log("cheguei até aqui")
    fetch(link)
        .then((resp) => {
            console.log(resp)
            resp.json().then(data => {
                let encrypted = data.data
                let decrypted = decrypt(encrypted)
                console.log(decrypted)
                document.querySelector("#seeResult").innerHTML = JSON.stringify(decrypted) + "<br"
            })
        })
}

function getNFTs() {
    divHtml = '';
    let account = document.querySelector("#account").value;
    fetch("http://127.0.0.1:3000/get-nfts", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ account: account })
    }).then((resp) => resp.json())
        .then(data => {
            console.log(data)
            data.forEach(nftRecord => {
                console.log(nftRecord['token_uri'])
                record = "<button onclick=fetch"
                divHtml += nftRecord['token_uri'] + "<br>";
            })
            document.querySelector("#NFTs").innerHTML = divHtml;

        });

}