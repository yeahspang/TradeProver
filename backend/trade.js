class Trade {
    constructor(id, steamid_other, assetIds, otherPersonaName) {
        this.id = id;
        this.steamid_other = steamid_other;
        this.assetIds = assetIds;
        this.otherPersonaName = otherPersonaName;
    }
}

module.exports = Trade;