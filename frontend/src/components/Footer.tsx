const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">E-Commerce</h2>
            <p className="text-gray-400 mt-1">Your one-stop shop for everything</p>
          </div>
          
          <div className="flex space-x-6">
            <div>
              <h3 className="font-semibold mb-2">Quick Links</h3>
              <ul className="text-gray-400">
                <li className="mb-1"><a href="/" className="hover:text-white">Home</a></li>
                <li className="mb-1"><a href="/products" className="hover:text-white">Products</a></li>
                <li className="mb-1"><a href="/cart" className="hover:text-white">Cart</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <ul className="text-gray-400">
                <li className="mb-1">Email: ayush@ecommerce.com</li>
                <li className="mb-1">Phone: 123456789</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;