import {useEffect, useRef} from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (momentListener?: (notification: any) => void) => void;
          cancel: () => void;
        };
      };
    };
    __googleOneTapInitialized?: boolean;
  }
}

export const useGoogleOneTap = (
  clientId: string,
  onSuccess: (credential: string) => void,
  shouldPrompt = true,
  shouldAutoLogin = false
) => {
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    if (window.__googleOneTapInitialized) {
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existingScript && window.google?.accounts?.id) {
      initializeGoogleOneTap();
      return;
    }

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        initializeGoogleOneTap();
      };

      script.onerror = () => {
        console.error("Google One Tap script failed to load.");
        window.__googleOneTapInitialized = false;
      };

      document.body.appendChild(script);
    }

    function initializeGoogleOneTap() {
      if (window.google?.accounts?.id && !window.__googleOneTapInitialized) {
        window.__googleOneTapInitialized = true;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (response.credential) {
              onSuccessRef.current(response.credential);
            }
          },
          auto_select: shouldAutoLogin,
          // Tenta usar FedCM, mas com fallback automático
          use_fedcm_for_prompt: true,
          itp_support: true,
        });

        if (shouldPrompt) {
          window.google.accounts.id.prompt((notification: any) => {
            const momentType = notification.getMomentType();
            const dismissedReason = notification.getDismissedReason();

            if (momentType === "display") {
              console.log("One Tap exibido com sucesso");
            } else if (momentType === "skipped") {
              console.warn("One Tap foi ignorado pelo usuário");
            } else if (momentType === "dismissed") {
              console.warn("One Tap foi fechado pelo usuário");

              // Se foi fechado devido ao FedCM, sugere ao usuário
              if (dismissedReason === "fedcm_disabled") {
                console.info(
                  "FedCM está desabilitado. Clique no ícone à esquerda da barra de URL para gerenciar o login de terceiros."
                );
              }
            } else {
              console.error("One Tap não foi exibido:", dismissedReason);

              // Lista de razões possíveis
              if (dismissedReason === "opt_out_or_no_session") {
                console.info(
                  "Usuário optou por não usar ou não tem sessão ativa"
                );
              } else if (dismissedReason === "secure_http_required") {
                console.error("HTTPS é necessário para One Tap");
              } else if (dismissedReason === "suppressed_by_user") {
                console.info(
                  "One Tap foi suprimido pelo usuário anteriormente"
                );
              } else if (dismissedReason === "credential_returned") {
                console.info("Credencial já foi retornada");
              } else if (dismissedReason === "fedcm_disabled") {
                console.warn(
                  "⚠️ FedCM desabilitado. Para habilitar:\n" +
                    "1. Clique no ícone 🔒 ou ⓘ à esquerda da URL\n" +
                    "2. Vá em 'Configurações do site'\n" +
                    "3. Habilite 'Login de terceiros'"
                );
              }
            }
          });
        }
      }
    }

    return () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [clientId, shouldPrompt, shouldAutoLogin]);
};
