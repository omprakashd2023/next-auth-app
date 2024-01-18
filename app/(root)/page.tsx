import { auth, signOut } from "@/auth";

import { Button } from "@/components/ui/button";

const Home = async () => {
  const user = await auth();
  const onSubmit = async () => {
    "use server";
    await signOut();
  };
  return (
    <main className="w-1/2">
      <div className="my-4">{JSON.stringify(user?.user?.id)}</div>
      <div className="my-4">{JSON.stringify(user?.user?.name)}</div>
      <div className="my-4">{JSON.stringify(user?.user?.email)}</div>
      <div className="my-4">{JSON.stringify(user?.user?.role)}</div>
      <form action={onSubmit}>
        <Button type="submit">Sign Out</Button>
      </form>
    </main>
  );
};

export default Home;
