import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/items?limit=4');
        setFeaturedItems(response.data.items);
      } catch (error) {
        console.error('Error fetching featured items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16 rounded-lg mb-12">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our E-Commerce Store</h1>
          <p className="text-xl mb-8">Discover amazing products at competitive prices</p>
          <Link 
            to="/products" 
            className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition duration-300"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Featured Products</h2>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                    <Link 
                      to={`/products/${item.id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-300"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-8">
          <Link 
            to="/products"
            className="text-blue-600 font-semibold hover:underline"
          >
            View All Products →
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Shop by Category</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {['electronics', 'clothing', 'home'].map((category) => (
            <Link 
              key={category}
              to={`/products?category=${category}`}
              className="bg-gray-100 rounded-lg p-8 text-center hover:bg-gray-200 transition duration-300"
            >
              <h3 className="text-xl font-semibold capitalize">{category}</h3>
              <p className="text-gray-600 mt-2">Explore {category}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Shopping?</h2>
        <p className="text-gray-600 mb-6">Create an account to get started with a personalized shopping experience.</p>
        <Link 
          to="/signup"
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  );
};

export default Home;