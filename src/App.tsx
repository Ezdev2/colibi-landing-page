import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProposalOnePage from "./pages/ProposalOne";
import ProposalTwoPage from "./pages/ProposalTwo";
import ProposalThreePage from "./pages/ProposalThree";
import SearchPage from "./pages/SearchPage";
import AuthPage from "./pages/AuthPage";
import AuthPage2 from "./pages/AuthPage2";
import ContestPage from "./pages/ContestPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProposalOnePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/login-2" element={<AuthPage2 />} />
        <Route path="/contest" element={<ContestPage />} />
        <Route path="/proposal-2" element={<ProposalTwoPage />} />
        <Route path="/proposal-3" element={<ProposalThreePage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}