import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { Menu as MenuIcon, X } from "lucide-react";
import { useCart } from "../context/CartContext";

const Navbar = ({ openLoginModal, openSignUpModal }) => {
  const navigate = useNavigate();
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
    navigate("/");
  };

  const menuPath = userProfile?.role === "admin" ? "/admin/menu" : "/menu";

  return (
    <header className="bg-restaurant-primary shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <div className="flex">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center">
            <img src="/zaanlogo.png" className="h-10 w-auto" alt="ZAAN Logo" />
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-x-10 items-center">
          <Link to="/" className="text-white hover:text-gray-300 text-sm font-medium transition transform hover:scale-110">Home</Link>
          <Link to={menuPath} className="text-white hover:text-gray-300 text-sm font-medium transition transform hover:scale-110">Menu</Link>
          {userProfile?.role === "admin" && (
            <>
              <Link to="/admin/dashboard" className="text-white hover:text-gray-300 text-sm font-medium transition transform hover:scale-110">Dashboard</Link>
            </>
          )}
          <Link to="/contact" className="text-white hover:text-gray-300 text-sm font-medium transition transform hover:scale-110">Contact</Link>
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
                <div className="absolute right-0 mt-3 w-48 bg-[#101214] text-white rounded-xl shadow-2xl ring-1 ring-white/5 p-4 z-50 animate-fade-in">
                  <p className="text-sm text-gray-300 mb-3">Hello, {userProfile?.name}</p>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 text-sm transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={openLoginModal} className="bg-restaurant-accent text-white px-4 py-2 rounded bg-red-500 hover:bg-red-700 text-sm font-medium">Login</button>
              <button onClick={openSignUpModal} className="bg-restaurant-accent text-white px-4 py-2 rounded bg-red-500 hover:bg-red-700 text-sm font-medium">Sign Up</button>
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
        <Dialog.Panel className="fixed inset-y-0 right-0 w-full sm:max-w-sm z-50 bg-[#111827] text-white px-6 py-6 shadow-2xl rounded-l-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <img src="/zaanlogo.png" className="h-8 w-auto" alt="Logo" />
            <button onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-gray-300 transition">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-5 text-base font-medium">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block hover:text-red-500 transition">Home</Link>
            <Link to={menuPath} onClick={() => setMobileMenuOpen(false)} className="block hover:text-red-500 transition">Menu</Link>
            {userProfile?.role === "admin" && (
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block hover:text-red-500 transition">Dashboard</Link>
            )}
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block hover:text-red-500 transition">Contact</Link>
            <Link to="/checkout" onClick={() => setMobileMenuOpen(false)} className="block hover:text-red-500 transition">Cart</Link>

            {isLoggedIn ? (
              <>
                <div className="pt-4 border-t border-gray-600">
                  <p className="mb-2 text-gray-300">Hello, <span className="font-semibold">{userProfile?.name}</span></p>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 font-medium transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-4 border-t border-gray-600 space-y-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); openLoginModal(); }}
                  className="block w-full text-left hover:text-red-500 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); openSignUpModal(); }}
                  className="block w-full text-left hover:text-red-500 transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Navbar;
