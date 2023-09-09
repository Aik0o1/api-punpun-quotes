const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const port = process.env.PORT || 5000

const fs = require("fs")
const csv = require("csv-parser")
const results = []

async function lerCSV() {
    return new Promise((resolve, reject) => {
        fs.createReadStream('server/finalQuotes.csv')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve()
            })
            .on("error", (error) => {
                reject(error)
            })
    })
}

function randomQuote() {
    const indice = Math.floor(Math.random() * results.length)
    return results[indice]
}

app.use(bodyParser.text())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", (req, res) => {
    res.send(randomQuote())
})


async function inciarServer() {
    await lerCSV()

    app.listen(port, () => {
        console.log(`Servidor executando na porta ${port}`)
    })
}
inciarServer()



