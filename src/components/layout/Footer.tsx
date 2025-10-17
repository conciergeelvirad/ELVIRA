export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="px-8">
        <p className="text-center text-xs text-gray-400">
          © {currentYear} ELVIRA CONCIERGE. Hotel Management System
        </p>
      </div>
    </footer>
  );
};
