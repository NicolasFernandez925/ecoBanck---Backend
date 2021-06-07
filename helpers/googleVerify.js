const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleVerify = async (tokenId) => {
  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { name: nombre, email, picture: img } = ticket.getPayload();

  return { nombre, email, img };
};

module.exports = {
  googleVerify,
};
