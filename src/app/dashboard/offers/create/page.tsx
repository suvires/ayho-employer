import CreateOfferForm from "@/ui/offers/offer-create-form";
import {
  getAttendances,
  getPlaces,
  getPositions,
  getSchedules,
  getSkills,
} from "@/lib/services";

export default async function Page() {
  const attendances = await getAttendances();
  const schedules = await getSchedules();
  const positions = await getPositions();
  const skills = await getSkills();
  const places = await getPlaces();
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
