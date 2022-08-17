if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');

//carregando os certificados
const cert = fs.readFileSync(
  path.resolve(__dirname, `./certs/${process.env.GN_CERT}`)
);
const agent = new https.Agent({
  pfx: cert,
  passphrase: '',
});

//gerando instancia axios com token de autenticao
const authenticate = ({ clientID, clientSecret }) => {
  const credentials = Buffer.from(
    `${clientID}:${clientSecret}`
  ).toString('base64');

  return axios({
    method: 'POST',
    url: `${process.env.GN_ENDPOINT}/oauth/token`,
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    httpsAgent: agent,
    data: {
      grant_type: 'client_credentials',
    },
  });
};

module.exports = {
  async GNRequest() {
    //obtendo access token e inserindo na instancia
    const authResponse = await authenticate({
      clientID: process.env.GN_CLIENT_ID,
      clientSecret: process.env.GN_CLIENT_SECRET,
    });
    const accessToken = authResponse.data?.access_token;

    return axios.create({
      baseURL: process.env.GN_ENDPOINT,
      httpsAgent: agent,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  },
};
