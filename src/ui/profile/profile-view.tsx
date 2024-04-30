import { CompanyImage } from "@/ui/components/company-image";
import { User } from "@/lib/definitions";
import Link from "next/link";

export default function ProfileView({ user }: { user: User }) {
  return (
    <>
      <CompanyImage
        src={
          (user.company.image_url &&
            `${process.env.BACKEND_URL}${user.company.image_url}`) ||
          "/images/logo-watermark.png"
        }
      />

      <h2>Mi nombre</h2>
      <p>{user.name}</p>
      <h2>Mi email</h2>
      <p>{user.email}</p>
      <h2>Mi empresa</h2>
      <p>{user.company.name}</p>
      <h2>Descripción de la empresa</h2>
      <p>{user.company.description}</p>
    </>
  );
}
