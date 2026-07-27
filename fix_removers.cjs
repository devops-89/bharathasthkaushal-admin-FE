const fs = require('fs');
['src/pages/Profile.jsx', 'src/api/auth.js', 'src/components/Header.jsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.split('localStorage.removeItem("accessToken");').join('localStorage.removeItem("accessToken"); sessionStorage.removeItem("accessToken");');
  content = content.split('localStorage.removeItem("refreshToken");').join('localStorage.removeItem("refreshToken"); sessionStorage.removeItem("refreshToken");');
  content = content.split('localStorage.removeItem("user");').join('localStorage.removeItem("user"); sessionStorage.removeItem("user");');
  fs.writeFileSync(file, content);
});
