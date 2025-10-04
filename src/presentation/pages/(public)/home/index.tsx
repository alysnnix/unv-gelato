import type {FC} from "react";
import {AppParse} from "@/services/app-parse";
import useGoogleOneTap from "@/hooks/useGoogleOneTap";

export const Home: FC = () => {
  useGoogleOneTap(import.meta.env.VITE_GOOGLE_CLIENT_ID, true, false);
  const user = AppParse.User.current();
  console.log("current user:", user);

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <h1>Home page</h1>

      {user && (
        <div className="group overflow-hidden flex items-center justify-center bg-black/30 p-3 rounded-full cursor-pointer active:scale-90">
          {user.get("picture") && (
            <img
              className="w-12 rounded-full border-2"
              src={user.get("picture")}
              alt="Foto de perfil"
            />
          )}
          <p className="w-0 opacity-0 invisible group-hover:ml-4 !duration-400 text-nowrap group-hover:w-[300px] group-hover:opacity-100 group-hover:visible text-xl">
            Bem-vindo, {user.get("fullName")}!
          </p>
        </div>
      )}
    </div>
  );
};
