import { useRouter } from "next/router";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const HomePage: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <MetaHeader title="Beccamose | Welcome" />

      <section className="flex flex-col gap-y-4 items-center justify-center w-full flex-1">
        <button className="btn btn-primary min-w-[15rem]" onClick={() => router.push("/invite")}>
          Connect Wallet
        </button>
        <button className="btn btn-secondary min-w-[15rem]">Connect New Account</button>
      </section>
    </>
  );
};

export default HomePage;
