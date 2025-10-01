import type {FC} from "react";
import useGoogleOneTap from "../../../hooks/useGoogleOneTap";

export const Home: FC = () => {
  useGoogleOneTap(import.meta.env.VITE_GOOGLE_CLIENT_ID, true, false);

  return (
    <div>
      <h1>Home page</h1>
    </div>
  );
};
