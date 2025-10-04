import { AppParse } from "@/services/app-parse";
import {useEffect} from "react";

const loginNoBack4AppComGoogle = async (googleResponse: {
  credential?: string;
}) => {
  const id_token = googleResponse.credential;

  if (!id_token) {
    console.error("ID Token do Google não encontrado.");
    return;
  }

  try {
    // Passo 1: Chamar a função de Cloud Code que criamos
    const sessionToken = await AppParse.Cloud.run("googleLogin", {id_token});

    // Passo 2: Fazer o login no cliente com o session token retornado pelo servidor
    const user = await AppParse.User.become(sessionToken);

    console.log("Usuário logado com sucesso via Cloud Code!", user);

    const fotoDoPerfil = user.get("picture");

    if (fotoDoPerfil) {
      console.log("URL da foto de perfil:", fotoDoPerfil);
    } else {
      console.log("URL da foto não foi encontrada.");
    }

    return user;
  } catch (error) {
    console.error(
      'Erro ao fazer login com a função de Cloud "googleLogin":',
      error
    );
  }
};

const useGoogleOneTap = (
  clientId: string,
  shouldPrompt: boolean,
  shouldAutoLogin: boolean
) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (!window) return;
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: loginNoBack4AppComGoogle,
          auto_select: shouldAutoLogin,
          use_fedcm_for_prompt: true,
          itp_support: true,
        });
        window.google.accounts.id.prompt();
      }
    };
    script.onerror = () => {
      console.error("Google One Tap script failed to load.");
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [clientId, shouldPrompt]);
};

export default useGoogleOneTap;
