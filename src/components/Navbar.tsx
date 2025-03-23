import Link from "next/link";
import Menu from "./Menu";
import Image from "next/image";
import SearchBar from "./SearchBar";
import dynamic from "next/dynamic";
// import NavIcons from "./NavIcons";

const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

const Navbar = () => {
  return (
    <div className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/">
          <div className="text-2xl tracking-wide">Brand</div>
        </Link>
        <Menu />
      </div>
      {/* BIGGER SCREENS */}
      <div className="hidden md:flex items-center justify-center gap-8 h-full">
        <section className="w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={150} height={150} />
            <div className="text-2xl tracking-wide"></div>
          </Link>
          {/* Centered Search Bar */}
          <div className="flex-1 flex justify-center">
            <SearchBar />
          </div>
          <NavIcons />
        </section>
      </div>

      {/* NAVIGATION LINKS ON NEXT LINE */}
      <div className="hidden xl:flex flex-col items-start gap-2 mt-2">
        <Link href="/">Homepage</Link>
        <Link href="/">Shop</Link>
        <Link href="/">Deals</Link>
        <Link href="/">About</Link>
        <Link href="/">Contact</Link>
      </div>
    </div>
  );
};

export default Navbar;
