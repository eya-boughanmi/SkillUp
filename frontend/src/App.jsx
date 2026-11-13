import { Routes, Route } from "react-router";

import PublicLayout from "./layouts/PublicLayout";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import DesignSystemPreview from "./pages/DesignSystemPreview";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ScrollToTop from "./components/ScrollToTop";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import Jobs from "./pages/public/Jobs";


function App() {
  return (
    <>
      <ScrollToTop />

      <Routes></Routes>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/about" element={<About />} />
        </Route>
        <Route
          path="/candidate/dashboard"
          element={<CandidateDashboard />}
        />
        <Route
          path="/recruiter/dashboard"
          element={<RecruiterDashboard />}
        />

        <Route path="/design-system" element={<DesignSystemPreview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>

  );
}

export default App;