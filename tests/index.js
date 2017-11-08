const expect = require('chai').expect;

const appKey = process.env.APP_KEY;
const appSecret = process.env.APP_SECRET;

const apiClient = require('../index.js').Client;
const client = new apiClient(appKey, appSecret);


describe('apiClient request test', function() {
    it('apiClient GET', async function() {
        
        const url = 'https://dm-81.data.aliyun.com/rest/160601/ip/getIpInfo.json?ip=210.75.225.254';
        const data = await client.get(url);
        expect(200).to.be.equal(data.code);
    });

    it('apiClient POST form', async function() {

        const data = await client.post({
            url: 'http://aa25c9177bb54cf6a4c99ddad7eabba6-cn-shanghai.alicloudapi.com/checkMobile',
            form: {
                mobile: "15612345678"
            }
        });
        expect(200).to.be.equal(data.code);

    });

    it('apiClient POST json', async function() {

        const data = await client.post({
            url: 'http://aa25c9177bb54cf6a4c99ddad7eabba6-cn-shanghai.alicloudapi.com/postjsonMobile',
            json: {
                mobile: "15612345678"
            }
        });
        expect(200).to.be.equal(data.code);

    });

});