const Header = ({ darkMode }) => {
  return (
    <header className={`py-6 shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-sepia-darker text-brown-900'} border-b-4 border-brown-600`}>
      <div className="container mx-auto flex items-center ">
          <img
            src="https://iitj.ac.in/images/logo/IIT-Logo.png"
            alt="IITJ Logo"
            className="h-24 mr-5 rounded-lg shadow-lg border border-gray-400 "
          />
        <div className="flex items-center justify-between px-32 lg:px-16">
          <h1 className="text-4xl font-serif font-bold leading-tight">
            Welcome to ERP - IITJ
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
