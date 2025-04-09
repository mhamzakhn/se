import { useState } from 'react';

const useModal = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Functions to open the modals
  const openLogin = () => {
    setShowSignUp(false);
    setShowLogin(true);
  };

  const openSignUp = () => {
    setShowLogin(false);
    setShowSignUp(true);
  };

  const closeLogin = () => setShowLogin(false);
  const closeSignUp = () => setShowSignUp(false);

  return {
    showLogin,
    showSignUp,
    openLogin,
    openSignUp,
    closeLogin,
    closeSignUp
  };
};

export default useModal;