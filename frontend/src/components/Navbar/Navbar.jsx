import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { Menu as MenuIcon, X } from "lucide-react";
import { useCart } from "../../context/CartContext";

const Navbar = ({ openLoginModal, openSignUpModal }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem("token")));
  const [userProfile, setUserProfile] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    const checkToken = () => setIsLoggedIn(Boolean(localStorage.getItem("token")));
    const interval = setInterval(checkToken, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("token");
      fetch("http://localhost:4000/api/v1/profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setUserProfile(data))
        .catch((err) => console.error("Error fetching profile:", err));
    } else {
      setUserProfile(null);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserProfile(null);
    setShowDropdown(false);
  };

  return (
    <header className="bg-restaurant-primary shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <div className="flex">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center">
            <img src="/zaanlogo.png" className="h-10 w-auto" alt="ZAAN Logo" />
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-x-10 items-center">
          <Link to="/" className="text-white hover:text-gray-300 text-sm font-medium">Home</Link>
          <Link to="/menu" className="text-white hover:text-gray-300 text-sm font-medium">Menu</Link>
          <Link to="/contact" className="text-white hover:text-gray-300 text-sm font-medium">Contact</Link>
          {userProfile?.role === "admin" && (
            <Link to="/admin/menu" className="text-white hover:text-gray-300 text-sm font-medium">Admin</Link>
          )}
        </div>

        {/* Cart + Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link to="/checkout" className="relative text-white">
            <FaShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full px-2">{cartCount}</span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <FaUserCircle size={24} className="text-white cursor-pointer" onClick={() => setShowDropdown(!showDropdown)} />
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-3 text-sm z-10">
                  <p className="mb-2 text-gray-800">Hello, {userProfile?.name || "User"}</p>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={openLoginModal} className="bg-restaurant-accent text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium">Login</button>
              <button onClick={openSignUpModal} className="bg-restaurant-accent text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium">Sign Up</button>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="lg:hidden">
          <button onClick={() => setMobileMenuOpen(true)} className="text-white">
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <Dialog.Panel className="fixed inset-y-0 right-0 w-full sm:max-w-sm z-50 bg-restaurant-primary px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <img src="/zaanlogo.png" className="h-8 w-auto" alt="Logo" />
            <button onClick={() => setMobileMenuOpen(false)} className="text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-4 text-white">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/menu" onClick={() => setMobileMenuOpen(false)}>Menu</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            {userProfile?.role === "admin" && (
              <Link to="/admin/menu" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
            )}
            <Link to="/checkout" onClick={() => setMobileMenuOpen(false)}>Cart</Link>

            {isLoggedIn ? (
              <>
                <p>Hello, {userProfile?.name}</p>
                <button onClick={handleLogout} className="text-red-400 hover:underline">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => { setMobileMenuOpen(false); openLoginModal(); }} className="text-white hover:underline">Login</button>
                <button onClick={() => { setMobileMenuOpen(false); openSignUpModal(); }} className="text-white hover:underline">Sign Up</button>
              </>
            )}
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Navbar;
