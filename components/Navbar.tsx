import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-row justify-end p-5">
      {session ? (
        <>
          <p>Welcome, {session?.user?.name}</p>
          <button onClick={() => signOut()} className="font-bold ml-3">
            Sign out
          </button>
        </>
      ) : null}
    </div>
  );
}
