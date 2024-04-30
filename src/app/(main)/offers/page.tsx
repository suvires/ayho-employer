import { getUser, getMyCompanyOffers } from "@/lib/services";
import CreateCompanyForm from "@/ui/company/company-create-form";
import OffersList from "@/ui/offers/offers-list";

export default async function Page() {
  const user = await getUser();
  const offers = await getMyCompanyOffers();

  return <main>{offers && <OffersList offers={offers} />}</main>;
}
