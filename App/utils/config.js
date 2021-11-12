import AppString from '@String';

class Config {
  get(key) {
    return AppString.map_token_string;
  }
}

const config = new Config();
export default config;