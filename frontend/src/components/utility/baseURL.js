let baseUrl;

if (process.env.NODE_ENV === 'production') {
  // Set the deployed URL
    baseUrl = "https://acebook-u9ao.onrender.com";
} else {
  // Set the local URL
    baseUrl = "http://localhost:8080";
}

export default baseUrl;