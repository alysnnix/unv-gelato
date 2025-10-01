/**
 * Função de Cloud para login com Google.
 * Recebe um id_token do cliente, verifica com o Google, e então
 * cria ou loga um usuário no Parse.
 * @param {string} id_token O ID Token JWT fornecido pelo Google.
 * @returns {string} O sessionToken para o usuário logado.
 */

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
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API do Google: ${response.status} ${errorText}`);
    }
    googleData = await response.json();
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
  }

  // Gera uma nova senha aleatória para cada login social
  const password = Math.random().toString(36).slice(-16);
  user.set("password", password);

  user.set("fullName", name);
  user.set("picture", picture);

  await user.save(null, {useMasterKey: true});

  // Faz o login com a senha que acabamos de gerar para obter um token de sessão
  const loggedInUser = await Parse.User.logIn(email, password);
  return loggedInUser.getSessionToken();
});
