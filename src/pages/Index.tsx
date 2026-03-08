import { useState } from "react";
import LoginPage from "./LoginPage";
import DashboardPage from "./DashboardPage";

const Index = () => {
  const [user, setUser] = useState<string | null>(null);

  if (!user) {
    return <LoginPage onLogin={(username) => setUser(username)} />;
  }

  return <DashboardPage username={user} onLogout={() => setUser(null)} />;
};

export default Index;
