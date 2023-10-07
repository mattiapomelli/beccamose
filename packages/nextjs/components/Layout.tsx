import { ReactNode } from "react";
import { Header } from "~~/components/Header";
import { useAutoConnect } from "~~/hooks/scaffold-eth";

export interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  useAutoConnect();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="relative flex flex-col flex-1">{children}</main>
    </div>
  );
};
