import EditCompanyForm from "@/ui/company/company-edit-form";
import { getUser } from "@/lib/services";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getUser();
  if (!user.company) {
    redirect("/create-company");
  }
  return <EditCompanyForm company={user.company} />;
}
