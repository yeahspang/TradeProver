const express = require("express");
const app = express();
const request = require('request');
const bodyParser = require("body-parser");
const Trade = require("./trade");
const ProofGenerator = require("./proofgenerator");
const cors = require('cors');
const config = require('./config.json');
const { constants } = require("crypto");
const AssetDescription = require("./assetdescription");


const proofGenerator = new ProofGenerator(config.EncryptionKey, config.IntializationVector);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const corsOptions = {
    origin: "http://localhost:3400"
}
app.use(cors(corsOptions));

app.listen(8080, () => {
    console.log("Server running on port 8080");
});

app.post('/api/trades/verify', (req, res) => {
    var encryptedCode = req.body.encryptedCode;
    const trade = proofGenerator.Decrypt(encryptedCode);
    res.send(trade);
})

app.post('/api/trades/proof', (req, res, next) => {
    var apikey = req.body.ApiKey;
    var tradeId = req.body.TradeId;

    request({
        uri: `https://api.steampowered.com/IEconService/GetTradeHistory/v1/?key=${apikey}&max_trades=10`,
        method: "GET",
    }, function (err, resp, body) {
        if (err) {
            console.log(err);
        }
        const response = JSON.parse(body);
        const allTrades = response.response.trades;
        var successfulTrades = allTrades.filter(trade => trade.status == 3 && trade.assets_given != null);

        var trade = successfulTrades[tradeId - 1]
        var assets = [];
        if (trade.assets_given != null) {
            for (const asset of trade.assets_given) {
                assets.push({
                    appId: asset.appid,
                    assetId: asset.assetid
                });
            }
        }
        let minifiedTrade = new Trade(tradeId, trade.steamid_other, assets);
        var proof = proofGenerator.Encrypt(JSON.stringify(minifiedTrade));
        res.send({ proof: proof });
    });
});

app.post('/api/trades/table', (req, res, next) => {
    var apikey = req.body.ApiKey;
    request({
        uri: `https://api.steampowered.com/IEconService/GetTradeHistory/v1/?key=${apikey}&max_trades=10&get_descriptions=1`,
        method: "GET",
    }, function (err, resp, body) {
        if (err) {
            console.log(err);
        }

        var minifiedTrades = [];

        const response = JSON.parse(body);
        const allTrades = response.response.trades;
        var successfulTrades = allTrades.filter(trade => trade.status == 3 && trade.assets_given != null);

        const allDescriptions = response.response.descriptions;
        var tradeDescMapping;
        allTrades.forEach(trade => {
            allDescriptions.forEach(desc => {

            });
        });


        var steamids = successfulTrades.map((value) => value.steamid_other).filter((value, index, self) => self.indexOf(value) === index);

        //Get the steam player summaries
        request({
            uri: `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apikey}&steamids=${steamids.join(",")}`,
            method: "GET"
        }, function (err, resp, body) {
            if (err) {
                console.log(err);
            }

            body = JSON.parse(body);
            var players = body.response.players;


            let index = 1;
            for (const trade of successfulTrades) {
                var assets = [];
                for (const asset of trade.assets_given) {
                    var assetDesc;
                    for (const desc of allDescriptions) {
                        //console.log(desc.name);
                        if (asset.appid == desc.appid && asset.classid == desc.classid && asset.instanceid == desc.instanceid) {
                            assetDesc = new AssetDescription(desc.icon_url_large, desc.name_color, desc.name);
                        }
                    };

                    assets.push({
                        appId: asset.appid,
                        assetId: asset.assetid,
                        description: assetDesc
                    });

                }
                let minifiedTrade = new Trade(index, trade.steamid_other, assets, players.filter((value) => value.steamid == trade.steamid_other)[0].personaname);
                console.log(minifiedTrade);
                minifiedTrades.push(minifiedTrade);
                index++;
            }
            res.send(minifiedTrades);

        });
    });
});

