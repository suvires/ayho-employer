"use client";

import { Offer } from "@/lib/definitions";
import { deleteOffer, publishOffer, unpublishOffer } from "@/lib/actions";
import { useState } from "react";
import { Card } from "@/ui/components/card";
import Link from "next/link";

interface OfferItemProps {
  offer: Offer;
}

export default function OfferItem({ offer }: OfferItemProps) {
  const deleteOfferWithId = deleteOffer.bind(null, offer.id);
  const publishOfferWithId = publishOffer.bind(null, offer.id);
  const unpublishOfferWithId = unpublishOffer.bind(null, offer.id);
  const [submenu, setSubmenu] = useState(false);

  return (
    <Card>
      <article>
        <div>
          <div>
            <h2>{offer.title}</h2>
            {!offer.published && <small>Oculta</small>}
          </div>
        </div>
        <div
          className="submenu-overlay"
          style={{ display: submenu ? "block" : "none" }}
          onClick={() => setSubmenu(false)}
        />
        <div
          className="submenu"
          onClick={(e) => {
            setSubmenu(!submenu);
          }}
        >
          <div style={{ display: submenu ? "block" : "none" }}>
            <form action={deleteOfferWithId}>
              <button>Eliminar</button>
            </form>
            {offer.published == true && (
              <form action={unpublishOfferWithId}>
                <button>Despublicar</button>
              </form>
            )}
            {!offer.published && (
              <form action={publishOfferWithId}>
                <button>Publicar</button>
              </form>
            )}
            <Link href={`/edit-offer/${offer.id}`}>Editar</Link>
          </div>
        </div>
      </article>
    </Card>
  );
}
