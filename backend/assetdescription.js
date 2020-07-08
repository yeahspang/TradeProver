class AssetDescription {
    constructor(icon_url_large, name_color, name) {
        this.color = name_color;
        this.img = icon_url_large;
        this.name = name;
    }
}

module.exports = AssetDescription;