import {AppParse} from "@/services/app-parse";
import {useGoogleOneTap} from "@/hooks/useGoogleOneTap";
import {useSession, useSessionSelector} from "@/store/session";
import {useEffect, type FC} from "react";
import {useNavigate} from "react-router";

export const Home: FC = () => {
  const session = useSession();
  const user = useSessionSelector((state) => state.context.user);
  const isAuthenticated = useSessionSelector((state) =>
    state.matches("authenticated")
  );
  const isReady = useSessionSelector((state) =>
    state.matches("authenticated.ready")
  );
  const navigate = useNavigate();

  const handleGoogleLogin = async (id_token: string) => {
    try {
      const sessionToken = await AppParse.Cloud.run("googleLogin", {id_token});
      const loggedUser = await AppParse.User.become(sessionToken);
      session.send({type: "LOGIN_SUCCESS", user: loggedUser});
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const handleManualGoogleLogin = () => {
    // @ts-ignore - Google Identity Services
    if (window.google && window.google.accounts) {
      // @ts-ignore
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log("One Tap prompt was not displayed or skipped");
        }
      });
    }
  };

  useGoogleOneTap(
    import.meta.env.VITE_GOOGLE_CLIENT_ID,
    handleGoogleLogin,
    true,
    false
  );

  // Redireciona para /dash quando o usuário estiver autenticado e pronto
  useEffect(() => {
    if (isAuthenticated && isReady && user) {
      navigate("/dash", {replace: true});
    }
  }, [isAuthenticated, isReady, user, navigate]);

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <h1 className="text-4xl font-bold">Home page</h1>

      {!user && (
        <button
          onClick={handleManualGoogleLogin}
          className="flex items-center gap-3 bg-white text-gray-700 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 font-medium">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Entrar com Google
        </button>
      )}

      {user && (
        <div className="group overflow-hidden flex items-center justify-center bg-black/30 p-3 rounded-full cursor-pointer active:scale-90">
          {user?.get("picture") && (
            <img
              className="w-12 rounded-full border-2"
              src={user?.get("picture")}
              alt="Foto de perfil"
            />
          )}
          <p className="w-0 opacity-0 invisible group-hover:ml-4 !duration-400 text-nowrap group-hover:w-[300px] group-hover:opacity-100 group-hover:visible text-xl">
            Bem-vindo, {user.get("fullName")}!
          </p>
        </div>
      )}

      {isAuthenticated && !isReady && (
        <div className="text-center">
          <p>Carregando seus dados...</p>
        </div>
      )}
    </div>
  );
};
