'use strict';
const rp = require('request-promise');
const parse = require("url").parse;
const crypto = require('crypto');
const uuid = require('uuid');
const pkg = require('../package.json');


function sign(stringToSign, appSecret) {
    return crypto.createHmac('sha256', appSecret)
        .update(stringToSign, 'utf8').digest('base64');
}

function md5(content) {
    return crypto.createHash('md5')
        .update(content, 'utf8')
        .digest('base64');
}

function buildHeaders(headers = {}, client) {
    return Object.assign({
        'x-ca-timestamp': Date.now(),
        'x-ca-key': client.appKey,
        'x-ca-nonce': uuid.v4(),
        'x-ca-stage': client.stage,
        'user-agent': client.ua,
        'accept': 'application/json' //默认设置json
    }, toLowerCaseKeys(headers));
}

function toLowerCaseKeys(headers = {}) {
    var loweredHeaders = {};

    var keys = Object.keys(headers);

    keys.map((key) => {
        loweredHeaders[key.toLowerCase()] = headers[key];
    });

    return loweredHeaders;
}

//如下参数不参与 Headers 签名计算：
//X-Ca-Signature、X-Ca-Signature-Headers、Accept、Content-MD5、Content-Type、Date
function getSignHeaderKeys(headers) {
    var keys = Object.keys(headers).sort();
    // 按字典序排序
    return keys.sort();
}

function getSignedHeadersString(signHeaderKeys, headers) {
    var list = [];
    signHeaderKeys.map((key) => {
        list.push(`${key}:${headers[key]}`);
    });

    return list.join('\n');
}

function buildUrl(url, data = {}) {

    const parsedUrl = parse(url, true);
    var path = parsedUrl.pathname;

    var queries = Object.assign(parsedUrl.query, data);

    if (Object.keys(queries).length) {

        var keys = Object.keys(queries).sort();

        var list = [];

        keys.map((key) => {
            if (queries[key] && ('' + queries[key])) {
                list.push(`${key}=${queries[key]}`);
            } else {
                list.push(`${key}`);
            }
        });

        path += '?' + list.join('&');
    }

    return path;
}

function buildStringToSign(method, headers, signedHeadersStr, url, formData) {
    const LF = '\n';
    var list = [method.toUpperCase(), LF];

    var accept = headers['accept'];
    if (accept) {
        list.push(accept);
    }
    list.push(LF);

    var contentMD5 = headers['content-md5'];
    if (contentMD5) {
        list.push(contentMD5);
    }
    list.push(LF);

    var contentType = headers['content-type'] || '';
    if (contentType) {
        list.push(contentType);
    }
    list.push(LF);

    var date = headers['date'];
    if (date) {
        list.push(date);
    }
    list.push(LF);

    if (signedHeadersStr) {
        list.push(signedHeadersStr);
        list.push(LF);
    }

    if (contentType.startsWith('application/x-www-form-urlencoded')) {
        list.push(buildUrl(url, formData));
    } else {
        list.push(buildUrl(url));
    }

    return list.join('');
}

class Client {

    constructor(key, secret, stage = 'RELEASE') { //TEST 、PRE 和 RELEASE
        this.appKey = key;
        this.appSecret = Buffer.from(secret, 'utf8');
        this.stage = stage;
        this.ua = `${pkg.name}/${pkg.version} Node.js/${process.version}`;
    }

    async request(options) {

        var clientOpt = {
            appKey: this.appKey,
            stage: this.stage,
            ua: this.ua
        }
        var headers = buildHeaders(options.headers, clientOpt);

        //Body 非 Form 表单时才计算 MD5
        var requestContentType = headers['content-type'] || '';
        if (options.method.toUpperCase() === 'POST' && !requestContentType.startsWith('application/x-www-form-urlencoded')) {
            headers['content-md5'] = md5(options.body);
        }

        var signHeaderKeys = getSignHeaderKeys(headers);

        headers['x-ca-signature-headers'] = signHeaderKeys.join(',');

        var signedHeadersStr = getSignedHeadersString(signHeaderKeys, headers);

        var stringToSign = buildStringToSign(options.method, headers, signedHeadersStr, options.url, options.form);

        headers['x-ca-signature'] = sign(stringToSign, this.appSecret);

        options.headers = headers;

        //return FullResponse
        options.resolveWithFullResponse = true;

        try {
            const response = await rp(options);

            return {
                code: response.statusCode,
                requestId: response.headers['x-ca-request-id'],
                data: JSON.parse(response.body),
                msg: 'OK'
            };

        } catch (err) {

            const response = err.response;
            return {
                code: response.statusCode,
                requestId: response.headers['x-ca-request-id'],
                data: {},
                msg: response.headers['x-ca-error-message']
            };
        }

    }
}


module.exports = Client;