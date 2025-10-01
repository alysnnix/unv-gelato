/**
 * Função de Cloud para login com Google.
 * Recebe um id_token do cliente, verifica com o Google, e então
 * cria ou loga um usuário no Parse.
 * @param {string} id_token O ID Token JWT fornecido pelo Google.
 * @returns {string} O sessionToken para o usuário logado.
 */

const axios = require("axios");

Parse.Cloud.define("googleLogin", async (request) => {
  const {id_token} = request.params;

  if (!id_token) {
    throw new Error("O ID Token do Google é necessário.");
  }

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    throw new Error(
      "O GOOGLE_CLIENT_ID não está configurado nas variáveis de ambiente do servidor."
    );
  }

  let googleData;
  try {
    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`
    );
    googleData = googleResponse.data;
  } catch (error) {
    throw error;
  }

  if (googleData.aud !== googleClientId) {
    throw new Error(
      "Token inválido: O 'audience' do token não corresponde ao Client ID do app."
    );
  }
  if (
    googleData.iss !== "accounts.google.com" &&
    googleData.iss !== "https://accounts.google.com"
  ) {
    throw new Error("Token inválido: Emissor (issuer) incorreto.");
  }

  const {email, name, picture} = googleData;

  if (!email) {
    throw new Error("Não foi possível obter o e-mail do token do Google.");
  }

  const userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("email", email);
  let user = await userQuery.first({useMasterKey: true});

  if (!user) {
    user = new Parse.User();
    user.set("username", email);
    user.set("email", email);
    user.set("password", Math.random().toString(36).slice(-16));
  }

  user.set("fullName", name);
  user.set("picture", picture);

  await user.save(null, {useMasterKey: true});

  const loggedInUser = await Parse.User.logIn(
    user.get("username"),
    user.get("password")
  );
  return loggedInUser.getSessionToken();
});
