import { signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";

export default async function AppNavbar() {
  return (
    <>
      <header className="app-header">
        <h1>
          <Image
            src="/images/logo.png"
            width={107}
            height={40}
            alt="Logotipo de ayho"
            priority={true}
          />
        </h1>
      </header>
      <nav className="app-navbar">
        <ul>
          <li>
            <Link href="/offers/">Ofertas</Link>
          </li>
          <li>
            <Link href="/create-offer">Publicar oferta</Link>
          </li>
          <li>
            <Link href="/profile">Perfil</Link>
          </li>
          <li>
            <form
              action={async (formData) => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button>Salir</button>
            </form>
          </li>
        </ul>
      </nav>
    </>
  );
}
