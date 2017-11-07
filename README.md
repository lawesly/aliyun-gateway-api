## aliyun-gateway-api
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

```
var apiClient = require('aliyun-gateway-api').Client;
var client = new apiClient(appKey, appSecret);

co(function*() {
    const url = 'https://dm-81.data.aliyun.com/rest/160601/ip/getIpInfo.json?ip=210.75.225.254';
    const data = yield client.get(url);

    console.log(JSON.stringify(data));
});

```
### POST Form Data 

```
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

```
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