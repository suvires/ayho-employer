import { getUser } from "@/lib/services";
import CreateCompanyForm from "@/ui/company/company-create-form";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getUser();
  if (user.company) {
    redirect("/profile");
  }

  return <CreateCompanyForm user={user} />;
}
