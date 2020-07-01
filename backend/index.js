const express = require("express");
const app = express();
const request = require('request');
const bodyParser = require("body-parser");
const Trade = require("./trade");
const ProofGenerator = require("./proofgenerator");
const cors = require('cors');
const config = require('./config.json');


const proofGenerator = new ProofGenerator(config.EncryptionKey, config.IntializationVector);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const corsOptions = {
    origin: "http://localhost:3400"
}
app.use(cors(corsOptions));

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.post('/trades/verify', (req, res) => {
    var encryptedCode = req.body.encryptedCode;
    const trade = proofGenerator.Decrypt(encryptedCode);
    res.send(trade);
})

app.post('/trades/proof', (req, res, next) => {
    var apikey = req.body.ApiKey;
    var tradeId = req.body.TradeId;

    request({
        uri: `https://api.steampowered.com/IEconService/GetTradeHistory/v1/?key=${apikey}&max_trades=10`,
        method: "GET",
    }, function(err, resp, body) {
        if(err) {
            console.log(err);
        }
        const response = JSON.parse(body);
        const allTrades = response.response.trades;
        var successfulTrades = allTrades.filter(trade => trade.status == 3);

        var trade = successfulTrades[tradeId - 1]
        var assets = [];
        for (const asset of trade.assets_given) {
            assets.push({
                appId: asset.appid,
                assetId: asset.assetid
            });
        }
        let minifiedTrade = new Trade(tradeId, trade.steamid_other, assets);
        var proof = proofGenerator.Encrypt(JSON.stringify(minifiedTrade));
        res.send({proof: proof});
    });
});

app.post('/trades/table', (req, res, next) => {
    var apikey = req.body.ApiKey;
    request({
        uri: `https://api.steampowered.com/IEconService/GetTradeHistory/v1/?key=${apikey}&max_trades=10`,
        method: "GET",
    }, function(err, resp, body) {
        if(err) {
            console.log(err);
        }

        var minifiedTrades = [];

        const response = JSON.parse(body);
        const allTrades = response.response.trades;
        var successfulTrades = allTrades.filter(trade => trade.status == 3);

        let index = 1;
        for (const trade of successfulTrades) {
            var assets = [];
            console.log(trade);
            if(!trade.assets_given) continue;
            for (const asset of trade.assets_given) {
                assets.push({
                    appId: asset.appid,
                    assetId: asset.assetid
                });
            }
            let minifiedTrade = new Trade(index, trade.steamid_other, assets);
            minifiedTrades.push(minifiedTrade);
            index++;
        }
        res.send(minifiedTrades);
    });
});

//const input = "4b24680e9ba2f6299e0b6ceb510b87c605c19389b3d2287fbe3a05c474b61f0c5baebd79c9bfe70dfd4465d291527a0cc87cf1b5eca13b3451b18f8be0d1e3c79694279f0807ed93047f58fa7f66073c25ad97a2ab550385d948a913affecd1b";
//console.log(proofGenerator.Decrypt(input));

// var proof = proofGenerator.Encrypt(JSON.stringify(minifiedTrades));
