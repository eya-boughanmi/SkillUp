
import { Outlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";
import "../styles/public-layout.css";

import "../styles/public-layout.css";

function PublicLayout() {
  const location = useLocation();

  return (
    <div className="public-layout">
      <Navbar />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="public-main"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default PublicLayout;
