export const FooterSection = () => {
  return (
    <footer
      className="
        pb-5 mt-4 pt-5
        bg-white/40 dark:bg-gray-900/30
        backdrop-blur-xl
        border-t border-gray-700/60 dark:border-gray-700/50
        w-full
        transition-all
      "
    >
      <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-300 px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-6">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              AI Expense Tracker
            </p>
            <p className="mt-2 text-sm opacity-80">
              Made to help you spend smarter.
            </p>

            <p className="text-sm mt-1 text-blue-600 dark:text-blue-400 font-medium">
              Made by Deepak
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-5 items-center">
            <a href="#" className="text-sm hover:underline">
              Privacy
            </a>
            <a href="#" className="text-sm hover:underline">
              Terms
            </a>
            <a href="#" className="text-sm hover:underline">
              Contact
            </a>
          </div>
        </div>

        {/* Bottom line */}
        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};
