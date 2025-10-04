import {AppParse} from "@/services/app-parse";
import {useEffect} from "react";

const loginWithGoogleOnBack4App = async (googleResponse: {
  credential?: string;
}) => {
  const id_token = googleResponse.credential;

  if (!id_token) {
    console.error("Google ID Token not found.");
    return;
  }

  try {
    const sessionToken = await AppParse.Cloud.run("googleLogin", {id_token});
    const user = await AppParse.User.become(sessionToken);
    console.log("User logged in successfully via Cloud Code!", user);
    const profilePicture = user.get("picture");

    if (profilePicture) {
      console.log("Profile picture URL:", profilePicture);
    } else {
      console.log("Picture URL not found.");
    }

    return user;
  } catch (error) {
    console.error('Error logging in with Cloud function "googleLogin":', error);
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
          callback: loginWithGoogleOnBack4App,
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
