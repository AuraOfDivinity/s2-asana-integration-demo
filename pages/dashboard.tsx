import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <Layout>
      <div className="p-5">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome to your actions dashboard!</p>
        <p className="mt-2">Access Token: {session && session.accessToken}</p>
        <p>JWT Token: {session && session.jwtToken}</p>
      </div>
    </Layout>
  );
}
