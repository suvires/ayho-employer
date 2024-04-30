import ProfileView from "@/ui/profile/profile-view";
import { getUser } from "@/lib/services";
import Link from "next/link";

export default async function Page() {
  const user = await getUser();
  return (
    <>
      <ProfileView user={user} />
      <Link className="btn btn--primary" href="/edit-company">
        Editar empresa
      </Link>
    </>
  );
}
