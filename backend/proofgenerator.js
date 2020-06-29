const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
class ProofGenerator {
    constructor() {
        this.privateKey = "testingsupersecretkey";
    }

    Encrypt(text) {
        let cipher = crypto.createCipher(algorithm, this.privateKey);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final("hex");
        return encrypted;
    }
       
    Decrypt(text) {
        const decipher = crypto.createDecipher(algorithm, this.privateKey);
        var decoded = decipher.update(text, 'hex', 'utf8');
        decoded += decipher.final('utf8');
        return decoded;
    }

}

module.exports = ProofGenerator;