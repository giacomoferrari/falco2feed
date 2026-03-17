const fs = require('fs');
const path = require('path');

async function refreshToken() {
  const tokenPath = path.join(__dirname, '..', 'token.json');
  const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
  const currentToken = tokenData.access_token;

  const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.access_token) {
    console.error('Errore refresh token:', data);
    process.exit(1);
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + data.expires_in * 1000);

  const newTokenData = {
    access_token: data.access_token,
    expires_at: expiresAt.toISOString(),
    last_refreshed: now.toISOString(),
    token_type: 'bearer',
    expires_in_days: Math.floor(data.expires_in / 86400)
  };

  fs.writeFileSync(tokenPath, JSON.stringify(newTokenData, null, 2));
  console.log('Token refreshato con successo!');
}

refreshToken().catch(console.error);
