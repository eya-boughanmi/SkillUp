import { Routes, Route } from "react-router";

import PublicLayout from "./layouts/PublicLayout";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import DesignSystemPreview from "./pages/DesignSystemPreview";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Route>

      <Route path="/design-system" element={<DesignSystemPreview />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;