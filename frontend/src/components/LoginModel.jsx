// LoginModal.jsx
import LoginPage from './LoginPage';
import './LoginModel.css';

const LoginModal = ({ openSignup, closeModal }) => {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      {/* Stop propagation so clicks inside the modal don’t close it */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={closeModal}>×</button>
        <LoginPage openSignup={openSignup} closeModal={closeModal} />
      </div>
    </div>
  );
};

export default LoginModal;
