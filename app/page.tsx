import Hero from "@/components/landing/hero/hero";
import Features from "@/components/landing/features/features";
import Footer from "@/components/landing/footer/footer";

export default async function HomePage() {

  return (
    <div className="max-w-7xl mx-auto w-full h-full md:border-2 md:border-y-0 border-t-0 border-b-0 border-dashed border-primary/50">
      <Hero />
      <Features />
      <Footer />
      
    </div>
  );
}
