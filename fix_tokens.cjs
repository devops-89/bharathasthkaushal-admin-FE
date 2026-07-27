const fs = require('fs');
let content = fs.readFileSync('src/api/config.js', 'utf8');

// Getters
content = content.split('localStorage.getItem("accessToken")').join('(sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken"))');
content = content.split('localStorage.getItem("refreshToken")').join('(sessionStorage.getItem("refreshToken") || localStorage.getItem("refreshToken"))');

// Setters
content = content.split('localStorage.setItem("accessToken", newToken);').join('if (sessionStorage.getItem("accessToken")) { sessionStorage.setItem("accessToken", newToken); } else { localStorage.setItem("accessToken", newToken); }');

const refreshReplacement = 'if (sessionStorage.getItem("refreshToken")) { sessionStorage.setItem("refreshToken", res.data?.data?.refreshToken || res.data?.refreshToken); } else { localStorage.setItem("refreshToken", res.data?.data?.refreshToken || res.data?.refreshToken); }';
content = content.split('localStorage.setItem("refreshToken", res.data?.data?.refreshToken || res.data?.refreshToken);').join(refreshReplacement);

// Removers
content = content.split('localStorage.removeItem("accessToken");').join('localStorage.removeItem("accessToken"); sessionStorage.removeItem("accessToken");');
content = content.split('localStorage.removeItem("refreshToken");').join('localStorage.removeItem("refreshToken"); sessionStorage.removeItem("refreshToken");');
content = content.split('localStorage.removeItem("user");').join('localStorage.removeItem("user"); sessionStorage.removeItem("user");');

fs.writeFileSync('src/api/config.js', content);
