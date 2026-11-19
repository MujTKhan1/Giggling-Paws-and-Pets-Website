import SiteHeader from "@/components/SiteHeader";
import PetParadeHero from "@/components/hero/PetParadeHero";
import ShopByPet from "@/components/shop/ShopByPet";
import PetFavourites from "@/components/favourites/PetFavourites";
import HappyPawsClub from "@/components/club/HappyPawsClub";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <PetParadeHero />
        <ShopByPet />
        <PetFavourites />
        <HappyPawsClub />
      </main>
    </>
  );
}
