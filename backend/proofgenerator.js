const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
class ProofGenerator {
    constructor(privatekey, iv) {
        this.privateKey = privatekey;
        this.iv = iv;
    }

    Encrypt(text) {
        let cipher = crypto.createCipheriv(algorithm, this.privateKey, this.iv);
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final("base64");
        return encrypted;
    }
       
    Decrypt(text) {
        const decipher = crypto.createDecipheriv(algorithm, this.privateKey, this.iv);
        var decoded = decipher.update(text, 'base64', 'utf8');
        decoded += decipher.final('utf8');
        return decoded;
    }

}

module.exports = ProofGenerator;