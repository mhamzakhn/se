
import React, { useEffect, useState } from 'react';
import { useCart }               from '../context/CartContext';
import slugify                   from 'slugify';
import { API_BASE_URL }          from '../config/api';
import { getMenuItems }          from '../services/menuService';

const DEFAULT_IMG = '/BeefChilliDry.jpeg';
const categories  = ['All','Starters','Soups','Chinese','Sandwiches','Burgers','Drinks'];

export default function MenuPage({ openLogin }) {
  const [menuData, setMenuData]         = useState([]);
  const [selectedCategory, setCategory] = useState('All');
  const [error, setError]               = useState(null);
  const [loading, setLoading]           = useState(true);
  const { addItemToCart }               = useCart();

  useEffect(() => {
    getMenuItems()
      .then(res => setMenuData(res.data.data))
      .catch(() => setError('Error fetching menu.'))
      .finally(() => setLoading(false));
  }, []);


  const grouped = menuData.reduce((acc, item) => {
    (acc[item.category] = acc[item.category]||[]).push(item);
    return acc;
  }, {});

  const renderCard = item => {
    const isStudent = localStorage.getItem('token')
                   && localStorage.getItem('studentStatus') === 'student';
    const price = isStudent
                ? item.discounted_price_for_LUMS_student
                : item.price;

    const slugFilename = slugify(item.name, { lower: true, strict: true }) + '.jpg';
    const slugFallback = `${API_BASE_URL}/images/${slugFilename}`;

    const initialSeeded = item.imageUrl;
    const initialSrc    = initialSeeded || slugFallback;

    const handleImgError = e => {
      const curr = e.currentTarget.src;
      if (curr === initialSrc && curr !== slugFallback) {
        e.currentTarget.src = slugFallback;
      } else if (curr === slugFallback) {
        e.currentTarget.src = DEFAULT_IMG;
      }
    };

    return (
      <div key={item.item_id}
           className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden relative hover:scale-105 transition-all duration-300">
        <img
          src={initialSrc}
          alt={item.name}
          onError={handleImgError}
          className="w-full h-48 object-contain bg-gray-800"
        />
        <div className="p-4">
          <h4 className="text-lg font-semibold text-white mb-1">{item.name}</h4>
          {item.description && (
            <p className="text-sm text-gray-400 mb-2">{item.description}</p>
          )}
          <p className="text-white font-bold text-sm">PKR {price}</p>
        </div>
        <button
          onClick={() => {
            if (!localStorage.getItem('token')) return openLogin();
            addItemToCart(item);
          }}
          className="absolute bottom-4 right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-gray-400 hover:scale-110 transition-transform"
          title="Add Item"
        >
          +
        </button>
      </div>
    );
  };

  if (loading) {
    return <div className="text-white text-center mt-10">Loading menu...</div>;
  }

  if (error) {
    return <div className="text-white text-center mt-10">{error}</div>;
  }

  return (
    <div className="bg-restaurant-primary min-h-screen py-16 px-6">
      <h2 className="text-4xl font-bold text-center text-white mb-12">
        Our Delicious Menu
      </h2>
      <div className="flex justify-center flex-wrap gap-4 mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
              selectedCategory === cat
                ? 'bg-white text-gray-900 shadow'
                : 'border-white text-white hover:bg-white hover:text-gray-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {(selectedCategory === 'All'
        ? categories.filter(c => c !== 'All')
        : [selectedCategory]
      ).map(cat => (
        <section key={cat} className="mb-16">
          <h3 className="text-2xl font-semibold text-white mb-6 text-center">
            {cat}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {grouped[cat]?.map(renderCard)}
          </div>
        </section>
      ))}
    </div>
  );
}
