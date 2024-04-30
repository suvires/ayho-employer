import { Offer } from "@/lib/definitions";
import Link from "next/link";
import OfferItem from "./offer-item";

export default function OffersList({ offers }: { offers: Offer[] }) {
  if (offers.length === 0)
    return (
      <div>
        <Link href="/create-offer">Publica tu primera oferta</Link>
      </div>
    );
  return (
    <ul className="offers-list">
      {offers.map((offer: Offer) => (
        <li key={offer.id}>
          <OfferItem offer={offer} />
        </li>
      ))}
    </ul>
  );
}
