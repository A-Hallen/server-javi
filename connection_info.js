const https = require("https");

/**
 * @typedef {Object} NetObject
 * @property {string} mac
 * @property {string} name
 * @property {string} lastip
 * @property {number} associd
 * @property {number} aprepeater
 * @property {number} tx
 * @property {number} rx
 * @property {number} signal
 * @property {number} rssi
 * @property {object} chainrssi
 * @property {number} rx_chainmask
 * @property {number} ccq
 * @property {number} idle
 * @property {number} tx_latency
 * @property {number} uptime
 * @property {number} ack
 * @property {number} distance
 * @property {number} txpower
 * @property {number} noisefloor
 * @property {object} tx_ratedata
 * @property {object} airmax
 * @property {object} stats
 * @property {object} rates
 * @property {object} signals
 */

class NetInfo {
  constructor(hostIp, username, password) {
    this.setUrls(hostIp);
    this.username = username;
    this.password = password;
    this.agent = new https.Agent({
      rejectUnauthorized: false,
    });
  }

  setUrls(hostIp) {
    this.loginUrl = `https://${hostIp}/login.cgi`;
    this.indexUrl = `https://${hostIp}/index.cgi`;
    this.staUrl = `https://${hostIp}/sta.cgi`;
  }

  /**
   * Asynchronously retrieves network information from the provided IP address.
   *
   * @param {string} ip - The IP address to retrieve network information for.
   * @return {Promise<NetObject>} A promise that resolves to the network information for the provided IP address.
   */
  async getNetworkInfoFromIp(ip) {
    return new Promise(async (resolve, reject) => {
      try {
        const netWorkInfo = await this.getNetworkInfo();
        const data = netWorkInfo.find((network) => network.lastip == ip);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Asynchronously retrieves network information.
   *
   * @return {Promise<object>} A promise that resolves all the network information.
   */
  async getNetworkInfo() {
    return new Promise(async (resolve, reject) => {
      const cookie = await this.prepareCookie();
      const data = await this.getData(cookie);
      resolve(data);
    });
  }

  /**
   * Retrieves network data by performing a series of asynchronous operations.
   *
   * @return {Promise<string>} A Promise that resolves to the network data.
   */
  async getStationData() {
    return new Promise(async (resolve, reject) => {
      const data = await this.getData(this.cookie);
      resolve(data);
    });
  }

  /**
   * Manage the initial queries to fetch a valid cookie for subsecuent operations
   *
   * @return {Promise<object>} A Promise that resolves to the network data.
   */
  async prepareCookie() {
    return new Promise(async (resolve, reject) => {
      this.cookie = await this.getHtmlPageCookie();
      await this.login(this.cookie);
      await this.getIndex(this.cookie);
      resolve(this.cookie);
    });
  }

  /**
   * Retrieves the cookie from the HTML page.
   *
   * @return {Promise<string>} A Promise that resolves with the cookie string.
   */
  async getHtmlPageCookie() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    return new Promise(async (resolve, reject) => {
      try {
        await fetch(this.loginUrl, {}).then((response) => {
          const cookie = response.headers.get("set-cookie");
          resolve(cookie);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * A function that performs a login operation.
   *
   * @param {string} oldCookie - The old cookie value.
   * @return {Promise<object>} A Promise that resolves to the new cookie value.
   */
  async login(oldCookie) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    return new Promise(async (resolve, reject) => {
      try {
        fetch(this.loginUrl, {
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "es-ES,es;q=0.9",
            "cache-control": "max-age=0",
            "content-type":
              "multipart/form-data; boundary=----WebKitFormBoundaryALMuqkhSCs6013ja",
            "sec-ch-ua":
              '"Chromium";v="118", "Opera GX";v="104", "Not=A?Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            cookie: oldCookie,
            Referer: this.loginUrl,
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
          body: `------WebKitFormBoundaryALMuqkhSCs6013ja\r\nContent-Disposition: form-data; name="uri"\r\n\r\n/index.cgi\r\n------WebKitFormBoundaryALMuqkhSCs6013ja\r\nContent-Disposition: form-data; name="username"\r\n\r\n${this.username}\r\n------WebKitFormBoundaryALMuqkhSCs6013ja\r\nContent-Disposition: form-data; name="password"\r\n\r\n${this.password}\r\n------WebKitFormBoundaryALMuqkhSCs6013ja--\r\n`,
          method: "POST",
        }).then((response) => {
          resolve(response.headers.get("set-cookie"));
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Retrieves the index from the server using a GET request.
   *
   * @param {string} cookie - The authentication cookie for the request.
   * @return {Promise<string>} A promise that resolves with the response from the server.
   */
  async getIndex(cookie) {
    return new Promise((resolve, reject) => {
      try {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        fetch(this.indexUrl, {
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "es-ES,es;q=0.9",
            "cache-control": "max-age=0",
            "sec-ch-ua":
              '"Chromium";v="118", "Opera GX";v="104", "Not=A?Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            cookie: this.cookie,
            Referer: `${this.loginUrl}`,
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
          agent: this.agent,
          body: null,
          method: "GET",
        }).then((response) => {
          resolve(response);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Retrieves data from the server using a cookie.
   *
   * @param {string} cookie - The cookie to authenticate the request.
   * @return {Promise<string>} A promise that resolves with the data retrieved from the server.
   */
  getData(cookie) {
    return new Promise((resolve, reject) => {
      try {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        fetch(this.staUrl, {
          headers: {
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "es-ES,es;q=0.9",
            "sec-ch-ua":
              '"Chromium";v="118", "Opera GX";v="104", "Not=A?Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            cookie: this.cookie,
            Referer: this.indexUrl,
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
          body: null,
          method: "GET",
        })
          .then((response) => response.json())
          .then((data) => resolve(data));
      } catch (error) {
        reject(error);
      }
    });
  }
}

exports.NetInfo = NetInfo;
