import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Observatory } from "./pages/Observatory";
import { Playbooks } from "./pages/Playbooks";
import { SmsSimulator } from "./pages/SmsSimulator";
import { OperationalReadiness } from "./pages/OperationalReadiness";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="playbooks" element={<Playbooks />} />
        <Route path="observatory" element={<Observatory />} />
        <Route path="sms-simulator" element={<SmsSimulator />} />
        <Route path="readiness" element={<OperationalReadiness />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
