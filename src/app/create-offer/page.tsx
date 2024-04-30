import CreateOfferForm from "@/ui/offers/offer-create-form";
import {
  getAttendances,
  getPlaces,
  getPositions,
  getSchedules,
  getSkills,
  getUser,
} from "@/lib/services";
import { sortPlaces } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getUser();
  if (!user.company) {
    redirect("/create-company");
  }
  const attendances = await getAttendances();
  const schedules = await getSchedules();
  const positions = await getPositions();
  const skills = await getSkills();
  const places = sortPlaces(await getPlaces());
  return (
    <CreateOfferForm
      attendances={attendances}
      schedules={schedules}
      positions={positions}
      skills={skills}
      places={places}
    />
  );
}
