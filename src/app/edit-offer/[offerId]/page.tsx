import EditOfferForm from "@/ui/offers/offer-edit-form";
import {
  getAttendances,
  getPlaces,
  getPositions,
  getSchedules,
  getSkills,
  getUser,
  getOffer,
} from "@/lib/services";
import { sortPlaces } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { offerId: string };
}) {
  const user = await getUser();
  if (!user.company) {
    redirect("/create-company");
  }
  const offer = await getOffer(params.offerId);
  const attendances = await getAttendances();
  const schedules = await getSchedules();
  const positions = await getPositions();
  const skills = await getSkills();
  const places = sortPlaces(await getPlaces());
  return (
    <EditOfferForm
      offer={offer}
      attendances={attendances}
      schedules={schedules}
      positions={positions}
      skills={skills}
      places={places}
    />
  );
}
