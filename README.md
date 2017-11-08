## aliyun-gateway-api 

[![npm-version](https://img.shields.io/npm/v/aliyun-gateway-api.svg)](https://npmjs.org/package/aliyun-gateway-api)
[![travis-ci](https://travis-ci.org/xihu-fm/aliyun-gateway-api.svg?branch=master)](https://travis-ci.org/xihu-fm/aliyun-gateway-api)
[![coverage](https://coveralls.io/repos/github/xihu-fm/aliyun-gateway-api/badge.svg?branch=master)](https://coveralls.io/github/xihu-fm/aliyun-gateway-api?branch=master)
[![npm-download](https://img.shields.io/npm/dm/aliyun-gateway-api.svg)](https://npmjs.org/package/aliyun-gateway-api)

[Aliyun gateway api](https://www.aliyun.com/product/apigateway) tools for Node.js


## Installation

You can install it as dependency with npm.

```sh
$ # save into package.json dependencies with -S
$ npm install aliyun-gateway-api -S
```

## Usage

The apiClient authrozied by appid & appsecret.


### GET Data 

```js
var apiClient = require('aliyun-gateway-api').Client;
var client = new apiClient(appKey, appSecret);

co(function*() {
    const url = 'https://dm-81.data.aliyun.com/rest/160601/ip/getIpInfo.json?ip=210.75.225.254';
    const data = yield client.get(url);

    console.log(JSON.stringify(data));
});

```
### POST Form Data 

```js
co(function*() {
    const data = yield client.post({
        url: 'http://aa25c9177bb54cf6a4c99ddad7eabba6-cn-shanghai.alicloudapi.com/checkMobile',
        form: {
            mobile: "15612345678"
        }
    });

    console.log(JSON.stringify(data));
});

```
### POST Json Data 

```js
co(function*() {

    const data = yield client.post({
        url: 'http://aa25c9177bb54cf6a4c99ddad7eabba6-cn-shanghai.alicloudapi.com/postjsonMobile',
        json: {
            mobile: "15612345678"
        }
    });

    console.log(JSON.stringify(data));
});
```

### Bugs

<img src='https://raw.githubusercontent.com/wongxming/dtalkNodejs/master/wongxming.jpg' width="240" height="240" />