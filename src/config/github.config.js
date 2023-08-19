require("dotenv").config();

module.exports = {
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubRedirectUrl: process.env.GITHUB_REDIRECT_URL,
};
