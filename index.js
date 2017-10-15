'use strict';

const https   = require('https');
const crypto  = require('crypto');
const url     = require('url');
const querystring = require('querystring');

const promisify  = require('nyks/function/promisify');
const request  = promisify(require('nyks/http/request'));
const sha1    = require('nyks/crypto/sha1');
const drain   = require('nyks/stream/drain');

  

class Ovh {

  constructor(params) {

    this.appKey = params.appKey;
    this.appSecret = params.appSecret;
    this.consumerKey = params.consumerKey || null;

    this.timeout = params.timeout;
    this.apiTimeDiff = params.apiTimeDiff || null;

    // Custom configuration of the API endpoint
    this.host = params.host || 'eu.api.ovh.com';
    this.basePath = params.basePath || '/1.0';

    if (typeof(this.appKey) !== 'string' || typeof(this.appSecret) !== 'string')
      throw new Error('[OVH] You should precise an application key / secret');
  }


  async request(method, path, params) {

    var endpoint = 'https://' + this.host + this.basePath + path;

    // Time drift
    if (!this.apiTimeDiff) {
      let req = await request('https://' + this.host + this.basePath  + '/auth/time');
      let time = JSON.parse(await drain(req));
      this.apiTimeDiff = time - Math.round(Date.now() / 1000);
    }

    if (path.indexOf('{') >= 0) {
      let newPath = path;
      for (let paramKey in params) {
        if (params.hasOwnProperty(paramKey)) {
          newPath = path.replace('{' + paramKey + '}', params[paramKey]);
          if (newPath !== path)
            delete params[paramKey];
          path = newPath;
        }
      }
    }


    let query = Object.assign(url.parse(endpoint), {
      method,
      headers : {
        'Content-Type': 'application/json',
        'X-Ovh-Application': this.appKey,
      }
    });

    // Remove undefined values
    for (let k in params) {
      if (!params[k])
        delete params[k];
    }

    let reqBody = null;

    if (typeof(params) === 'object' && Object.keys(params).length > 0) {
      if (method === 'PUT' || method === 'POST') {
        // Escape unicode
        reqBody = JSON.stringify(params).replace(/[\u0080-\uFFFF]/g, (m) => {
          return '\\u' + ('0000' + m.charCodeAt(0).toString(16)).slice(-4);
        });
        query.headers['Content-Length'] = reqBody.length;
      }
      else {
        query.path += '?' + querystring.stringify(params);
      }
    }

    if (path.indexOf('/auth') == -1) {
      query.headers['X-Ovh-Timestamp'] = Math.round(Date.now() / 1000) + this.apiTimeDiff;

      // Sign request
      if (typeof(this.consumerKey) === 'string') {
        query.headers['X-Ovh-Consumer'] = this.consumerKey;
        query.headers['X-Ovh-Signature'] = this.signRequest(
          method, endpoint,
          reqBody, query.headers['X-Ovh-Timestamp']
        );
      }
    }

    let req = await request(query);
    let body = await drain(req);
    var response = JSON.parse(body);
    return response;
  }


  signRequest(httpMethod, endpoint, body, timestamp) {
    return '$1$' + sha1([
      this.appSecret,
      this.consumerKey,
      httpMethod,
      endpoint,
      body || '',
      timestamp
    ].join('+'));
  }

}

module.exports = function(params) {
  return new Ovh(params);
};