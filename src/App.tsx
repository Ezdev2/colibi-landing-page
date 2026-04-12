import { HashRouter, Route, Routes } from "react-router-dom";

import ProposalOnePage from "./pages/ProposalOne";
import ProposalTwoPage from "./pages/ProposalTwo";
import ProposalThreePage from "./pages/ProposalThree";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ProposalOnePage />} />
        <Route path="/proposal-2" element={<ProposalTwoPage />} />
        <Route path="/proposal-3" element={<ProposalThreePage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </HashRouter>
  );
}
