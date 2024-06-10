import Layout from "../components/Layout";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (session) {
    return null;
  }
  return (
    <Layout>
      <div className="h-screen flex items-center justify-center flex">
        <div className="flex-column items-center text-center">
          <span className="font-bold text-lg">S2 Asana Integration POC</span>
          <div className="mt-8">
            <button
              className="border 1px solid p-4 rounded-md"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              Sign In With Google
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
