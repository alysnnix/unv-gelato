import {useEffect} from "react";

export const useGoogleOneTap = (
  clientId: string,
  onSuccess: (credential: string) => void,
  shouldPrompt = true,
  shouldAutoLogin = false
) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              onSuccess(response.credential);
            }
          },
          auto_select: shouldAutoLogin,
          use_fedcm_for_prompt: true,
          itp_support: true,
        });
        if (shouldPrompt) {
          window.google.accounts.id.prompt();
        }
      }
    };
    script.onerror = () => {
      console.error("Google One Tap script failed to load.");
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [clientId, onSuccess, shouldPrompt, shouldAutoLogin]);
};
