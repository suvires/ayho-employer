import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Image
        src="/images/logo.png"
        alt="Ayho Logo"
        width={346}
        height={129}
        priority
      />
      <Link href="/auth">Empezar a selecionar</Link>
    </main>
  );
}
