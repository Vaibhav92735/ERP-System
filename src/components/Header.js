const Header = ({ darkMode }) => {
  return (
    <header className={`py-4 shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-sepia-darker text-brown-900'} border-b-2 border-brown-600`}>
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          {/* Updated Logo - Use an old-style ERP logo or generic image */}
          <img
            src="https://img.freepik.com/premium-vector/erp-vector-icon-web_116137-3113.jpg?semt=ais_hybrid" // Update with the path to a more suitable old-style logo
            alt="Logo"
            className="h-10 w-10 mr-3 rounded-lg border border-gray-400"
          />
          {/* Heading in serif font for classic look */}
          <h1 className="text-2xl font-serif font-bold">Welcome to ERP - IITJ</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
