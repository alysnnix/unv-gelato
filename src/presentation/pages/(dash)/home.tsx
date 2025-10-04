import {SessionContext} from "@/store/session";

const Playground = () => {
  const user = SessionContext.useSelector((state) => state.context.user);

  console.log("User in session context:", user);

  return <div>Home Page - Authenticated</div>;
};

export const Home = () => {
  return (
    <>
      <Playground />
    </>
  );
};
