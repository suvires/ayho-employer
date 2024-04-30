import { getUser } from "@/lib/services";
import AppNavbar from "@/ui/components/app-navbar";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user.company) {
    redirect("/create-company");
  }
  return (
    <main className="app">
      <AppNavbar />
      <section className="app-content">{children}</section>
    </main>
  );
}
