import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeroSection from '../components/common/HeroSection';

const Home = ({ openLoginModal }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      openLoginModal();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, openLoginModal, setSearchParams]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-darkblue via-darkblue to-deepblack">
      <HeroSection openLoginModal={openLoginModal} />
    </div>
  );
};

export default Home;
