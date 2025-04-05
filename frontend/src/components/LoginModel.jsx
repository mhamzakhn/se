import LoginPage from './LoginPage';
import './LoginModal.css';

const LoginModal = ({ openSignup, closeModal }) => {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      {/* Stop propagation so clicks inside the modal don’t close it */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <LoginPage openSignup={openSignup} />
      </div>
    </div>
  );
};

export default LoginModal;
