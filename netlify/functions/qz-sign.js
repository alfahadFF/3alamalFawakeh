const crypto = require('crypto');

exports.handler = async (event) => {
    try {
        const request = event.queryStringParameters?.request || '';
        const privateKey = process.env.QZ_PRIVATE_KEY;

        if (!privateKey) {
            return { statusCode: 500, body: 'Missing QZ_PRIVATE_KEY' };
        }

        const signer = crypto.createSign('SHA1');
        signer.update(request);
        signer.end();

        const signature = signer.sign(privateKey, 'base64');

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/plain' },
            body: signature
        };
    } catch (err) {
        return { statusCode: 500, body: 'Signing error: ' + err.message };
    }
};
