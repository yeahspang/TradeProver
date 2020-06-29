class Trade {
    constructor(id, steamid_other, assetIds) {
        this.id = id;
        this.steamid_other = steamid_other;
        this.assetIds = assetIds;
    }
}

module.exports = Trade;