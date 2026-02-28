// seeds/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from '../models/MenuItem.js';

dotenv.config({ path: './config/config.env' });

console.log("MONGO URI:", process.env.MONGO_URI);

const menuData = [
  { item_id: 1,  name: 'Honey Wings (4 PCS.)',                    price: 900,  category: 'Starters',    discounted_price_for_LUMS_student: 800, imageUrl: '/images/honey-wings-4-pcs.jpg' },
  { item_id: 2,  name: 'Chicken Drumsticks (4 PCS.)',             price: 900,  category: 'Starters',    discounted_price_for_LUMS_student: 800, imageUrl: '/images/chicken-drumsticks-4-pcs.jpg' },
  { item_id: 3,  name: 'Vegetable Spring Rolls (6 PCS.)',         price: 600,  category: 'Starters',    discounted_price_for_LUMS_student: 500, imageUrl: '/images/vegetable-spring-rolls-6-pcs.jpg' },
  { item_id: 4,  name: 'Schezwan Fried Chicken',                  price: 1200, category: 'Starters',    discounted_price_for_LUMS_student: 1100, imageUrl: '/images/schezwan-fried-chicken.jpg' },
  { item_id: 5,  name: 'Steamed Dumpling (6 PCS.)',               price: 900,  category: 'Starters',    discounted_price_for_LUMS_student: 800, imageUrl: '/images/steamed-dumpling-6-pcs.jpg' },
  { item_id: 6,  name: 'Tempura Prawns',                          price: 2400, category: 'Starters',    discounted_price_for_LUMS_student: 2200, imageUrl: '/images/tempura-prawns.jpg' },
  { item_id: 7,  name: 'Stuffed Chili Prawns',                    price: 2400, category: 'Starters',    discounted_price_for_LUMS_student: 2200, imageUrl: '/images/stuffed-chili-prawns.jpg' },
  { item_id: 8,  name: 'Crispy Fried Prawns',                     price: 2400, category: 'Starters',    discounted_price_for_LUMS_student: 2200, imageUrl: '/images/crispy-fried-prawns.jpg' },
  { item_id: 9,  name: 'Explosive Prawns',                        price: 2400, category: 'Starters',    discounted_price_for_LUMS_student: 2200, imageUrl: '/images/explosive-prawns.jpg' },
  { item_id: 10, name: 'Zaan Special Soup',                       price: 500,  category: 'Soups',       discounted_price_for_LUMS_student: 450, imageUrl: '/images/zaan-special-soup.jpg' },
  { item_id: 11, name: 'Chicken Corn Soup',                       price: 400,  category: 'Soups',       discounted_price_for_LUMS_student: 350, imageUrl: '/images/chicken-corn-soup.jpg' },
  { item_id: 12, name: 'Hot & Sour Soup',                         price: 400,  category: 'Soups',       discounted_price_for_LUMS_student: 350, imageUrl: '/images/hot-and-sour-soup.jpg' },
  { item_id: 13, name: 'Chicken Manchurian',                      price: 900,  category: 'Chinese',     discounted_price_for_LUMS_student: 850, imageUrl: '/images/chicken-manchurian.jpg' },
  { item_id: 14, name: 'Schezwan Chicken',                        price: 1200, category: 'Chinese',     discounted_price_for_LUMS_student: 1150, imageUrl: '/images/schezwan-fried-chicken.jpg' },
  { item_id: 15, name: 'Sweet & Sour Chicken',                    price: 1200, category: 'Chinese',     discounted_price_for_LUMS_student: 1150, imageUrl: '/images/sweet-and-sour-chicken.jpg' },
  { item_id: 16, name: 'Kung Pao Chicken',                        price: 1200, category: 'Chinese',     discounted_price_for_LUMS_student: 1150, imageUrl: '/images/kung-pao-chicken.jpg' },
  { item_id: 17, name: 'Chicken Chili Dry',                       price: 1200, category: 'Chinese',     discounted_price_for_LUMS_student: 1150, imageUrl: '/images/chicken-chili-dry.jpg' },
  { item_id: 18, name: 'Black Pepper Chicken',                    price: 1200, category: 'Chinese',     discounted_price_for_LUMS_student: 1150, imageUrl: '/images/black-pepper-chicken.jpg' },
  { item_id: 19, name: 'Zaan Special Rice',                       price: 750,  category: 'Chinese',     discounted_price_for_LUMS_student: 700, imageUrl: '/images/zaan-special-rice.jpg' },
  { item_id: 20, name: 'Zaan Chowmein',                           price: 600,  category: 'Chinese',     discounted_price_for_LUMS_student: 550, imageUrl: '/images/zaan-chowmein.jpg' },
  { item_id: 21, name: 'Spicy Chicken Cheese Steak Sandwich',     price: 950,  category: 'Sandwiches', discounted_price_for_LUMS_student: 900, imageUrl: '/images/spicy-chicken-cheese-steak-sandwich.jpg' },
  { item_id: 22, name: 'Pesto Grilled Chicken Sandwich',          price: 950,  category: 'Sandwiches', discounted_price_for_LUMS_student: 900, imageUrl: '/images/pesto-grilled-chicken-sandwich.jpg' },
  { item_id: 23, name: 'Philly Cheese Steak Sandwich',            price: 1050, category: 'Sandwiches', discounted_price_for_LUMS_student: 1000, imageUrl: '/images/philly-cheese-steak-sandwich.jpg' },
  { item_id: 24, name: 'Zaan Classic Club Sandwich',              price: 950,  category: 'Sandwiches', discounted_price_for_LUMS_student: 900, imageUrl: '/images/zaan-classic-club-sandwich.jpg' },
  { item_id: 25, name: 'Chicken Tikka Panini',                    price: 850,  category: 'Sandwiches', discounted_price_for_LUMS_student: 800, imageUrl: '/images/pesto-grilled-chicken-sandwich.jpg' },
  { item_id: 26, name: 'Grilled Chicken Panini',                  price: 850,  category: 'Sandwiches', discounted_price_for_LUMS_student: 800, imageUrl: '/images/pesto-grilled-chicken-sandwich.jpg' },
  { item_id: 27, name: 'Fiery Crispy Chicken Burger',             price: 950,  category: 'Burgers',     discounted_price_for_LUMS_student: 900, imageUrl: '/images/fiery-crispy-chicken-burger.jpg' },
  { item_id: 28, name: 'Crispy Chicken Slider',                   price: 950,  category: 'Burgers',     discounted_price_for_LUMS_student: 900, imageUrl: '/images/crispy-chicken-slider.jpg' },
  { item_id: 29, name: 'Zaan Mighty Crunch Burger',               price: 1050, category: 'Burgers',     discounted_price_for_LUMS_student: 1000, imageUrl: '/images/fiery-crispy-chicken-burger.jpg' },
  { item_id: 30, name: 'Smash Beef Burger',                       price: 1050, category: 'Burgers',     discounted_price_for_LUMS_student: 1000, imageUrl: '/images/smash-beef-burger.jpg' },
  { item_id: 32, name: 'Cola Next',                               price: 70,   category: 'Drinks',      discounted_price_for_LUMS_student: 65,  imageUrl: '/images/cola-next.jpg' },
  { item_id: 33, name: 'Coca Cola',                               price: 70,   category: 'Drinks',      discounted_price_for_LUMS_student: 65,  imageUrl: '/images/coca-cola.jpg' },
  { item_id: 34, name: 'Water Bottle',                            price: 70,   category: 'Drinks',      discounted_price_for_LUMS_student: 65,  imageUrl: '/images/water-bottle.jpg' },
];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: "ZAAN" });
  console.log("Connected to database for seeding!");
  await MenuItem.deleteMany({});
  await MenuItem.insertMany(menuData);
  console.log("Menu data seeded successfully!");
  process.exit(0);
};

seedDB();
