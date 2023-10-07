import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const SingleChatPage: NextPage = () => {
  return (
    <>
      <MetaHeader title="Beccamose | Welcome" />

      <section className="flex flex-col gap-y-4 items-center justify-center w-full">
        <h1 className="w-full text-left font-semibold text-base mb-2">SingleChatPage</h1>
      </section>
    </>
  );
};

export default SingleChatPage;
