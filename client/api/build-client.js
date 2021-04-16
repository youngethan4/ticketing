import axios from 'axios';

// Can be called on server or on client
// Server: hard refresh, type in url, click link from domain
// doman = http://nameofservice.nameofnamespace.svc.cluster.local
// or create an External Name Service in k8s
// Client: Navigation from within the app
// domain = same domain as page currently on
const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: 'http://www.ey-testing.xyz/', //Change due to Digital Ocean bug
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
