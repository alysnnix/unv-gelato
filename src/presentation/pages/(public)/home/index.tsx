import {AppParse} from "@/services/app-parse";
import {useGoogleOneTap} from "@/hooks/useGoogleOneTap";
import {useSession, useSessionSelector} from "@/store/session";
import {FC, useEffect} from "react";
import {useNavigate} from "react-router";

export const Home: FC = () => {
  const navigate = useNavigate();

  const session = useSession();
  const user = useSessionSelector((state) => state.context.user);
  const isAuthenticated = useSessionSelector((state) =>
    state.matches("authenticated")
  );
  const isReady = useSessionSelector((state) =>
    state.matches("authenticated.ready")
  );

  const handleGoogleLogin = async (id_token: string) => {
    try {
      const sessionToken = await AppParse.Cloud.run("googleLogin", {id_token});
      const loggedUser = await AppParse.User.become(sessionToken);
      session.send({type: "LOGIN_SUCCESS", user: loggedUser});
      navigate("/dash");
    } catch (error) {
      console.error("Error during Google login:", error);
      session.send({type: "LOGOUT"});
    }
  };

  useGoogleOneTap(
    import.meta.env.VITE_GOOGLE_CLIENT_ID,
    handleGoogleLogin,
    true,
    false
  );

  const getCurrentUser = async () => {
    try {
      const currentUser = await AppParse.User.currentAsync();
      if (currentUser) {
        session.send({type: "LOGIN_SUCCESS", user: currentUser});
      } else {
        session.send({type: "LOGOUT"});
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      session.send({type: "LOGOUT"});
    }
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <h1 className="text-4xl font-bold">Home page</h1>
      <button
        style={{
          backgroundColor: "var(--color-ui-foreground)",
        }}
        onClick={getCurrentUser}>
        Go to Dashboard
      </button>

      {user && (
        <div className="group overflow-hidden flex items-center justify-center bg-black/30 p-3 rounded-full cursor-pointer active:scale-90">
          <h1>
            Olá, <strong>{user.get("fullName")?.split(" ")[0]}</strong>
          </h1>
          <img
            className="w-12 rounded-full border-2"
            src={user.get("picture")}
            alt="Foto de perfil"
          />
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
