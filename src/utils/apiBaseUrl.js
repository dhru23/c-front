const SERVER_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : 'http://192.168.231.168:8000';

export default SERVER_URL;
