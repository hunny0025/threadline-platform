import { HeroVideoBanner } from "../components/home/HeroVideoBanner";
import BannerStrip from "../components/home/BannerStrip";
import SocialProofStrip from "../components/home/SocialProofStrip";
import FeaturedCollections from "../components/home/FeaturedCollections";
import NewArrivals from "../components/home/NewArrivals";
import LookbookGrid from "../components/home/LookbookGrid";

export function Home() {
  return (
    <>
      <HeroVideoBanner />
      <BannerStrip />
      <SocialProofStrip />
      <FeaturedCollections />
      <NewArrivals />
      <LookbookGrid />
    </>
  );
}
