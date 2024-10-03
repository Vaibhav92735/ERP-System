const Header = ({ darkMode }) => {
    return (
      <header className={`py-4 shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-blue-600 text-white'}`}>
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center">
            <img
              src="https://www.shutterstock.com/image-vector/logo-erp-vector-illustration-modern-260nw-2162620727.jpg" // Update with the path to your logo
              alt="Logo"
              className="h-10 w-10 mr-3"
            />
            <h1 className="text-xl font-bold">Welcome to ERP - IITJ</h1>
          </div>
        </div>
      </header>
    );
  };
  
  export default Header;
  