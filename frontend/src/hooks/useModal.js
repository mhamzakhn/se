import { useState } from 'react';

const useModal = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const openLoginModal = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };

  const openSignUpModal = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

  const closeLoginModal = () => setShowLoginModal(false);
  const closeSignUpModal = () => setShowSignUpModal(false);

  return {
    showLoginModal,
    showSignUpModal,
    openLoginModal,
    openSignUpModal,
    closeLoginModal,
    closeSignUpModal,
  };
};

export default useModal;