const express = require("express");
const app = express();
const request = require('request');
const bodyParser = require("body-parser");
const Trade = require("./trade");
const ProofGenerator = require("./proofgenerator");
const cors = require('cors');
const proofGenerator = new ProofGenerator();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const corsOptions = {
    origin: "http://localhost:4200"
}
app.use(cors(corsOptions));

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

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
        let minifiedTrade = new Trade(trade.steamid_other, assets);
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

// var proof = proofGenerator.Encrypt(JSON.stringify(minifiedTrades));
