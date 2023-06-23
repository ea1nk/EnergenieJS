require('dotenv').config();
const axios = require('axios');

class EnerGenieSwitch {
  constructor(ip, password, debug = false) {
    this.ip = process.env.energenieIP;
    this.password = process.env.energeniePASSWORD;
    this.user = process.env.energenieUSER;
  }

  async doLogout() {
    try {
      const response = await this.postRequest(`http://${this.ip}/login.html`, { pw: '' });
      const html = response.data;
      const result = html.includes("EnerGenie Web:");
      
      if (this.debug) {
        if (result) {
          console.log(`Logout ${this.ip}: successful!!!`);
        } else {
          console.log(`Logout ${this.ip} --> ${html} <--: failed!!!`);
        }
      }
      
      return result;
    } catch (error) {
      console.error(`Logout ${this.ip}: failed!!!`);
      throw error;
    }
  }

  async doLogin() {
    try {
      const response = await this.postRequest(`http://${this.ip}/login.html`, { pw: this.password });
      const html = response.data;
      const result = !(html === '' || html.includes("EnerGenie Web:"));
      
      if (this.debug) {
        if (result) {
          console.log(`Login ${this.ip}: successful!!!`);
        } else {
          console.log(`Login ${this.ip}: failed!!!`);
        }
      }
      
      return result;
    } catch (error) {
      console.error(`Login ${this.ip}: failed!!!`);
      throw error;
    }
  }

  async getStatus() {
    try {
      if (await this.doLogin()) {
        const response = await this.getRequest(`http://${this.ip}/energenie.html`);
        const html = response.data;
        const matches = html.match(/var sockstates \= \[([0-1],[0,1],[0,1],[0,1])\]/);
        
        if (!matches || !matches[1]) {
          return false;
        }
        
        const states = matches[1].split(',');
        await this.doLogout();
        
        return {
          1: states[0],
          2: states[1],
          3: states[2],
          4: states[3]
        };
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error getting status:', error);
      throw error;
    }
  }

  async doSwitch(switches) {
    try {
      if (await this.doLogin()) {
        for (const [port, state] of Object.entries(switches)) {
          const ports = { 1: '', 2: '', 3: '', 4: '' };
          ports[port] = state;
          const params = {};
          
          for (const [port, state] of Object.entries(ports)) {
            if (state === EnerGenieSwitcher.ON || state === EnerGenieSwitcher.OFF) {
              params[`cte${port}`] = state;
            }
          }
          
          await this.postRequest(`http://${this.ip}`, params);
        }
        
        await this.doLogout();
      }
    } catch (error) {
      console.error('Error switching:', error);
      throw error;
    }
  }

  postRequest(url, fields) {
    return axios.post(url, new URLSearchParams(fields).toString());
  }

  getRequest(url) {
    return axios.get(url);
  }
}

EnerGenieSwitcher.ON = 1;
EnerGenieSwitcher.OFF = 0
