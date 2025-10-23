import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { CompanyDashboard } from './components/company/CompanyDashboard';
import { RetailerDashboard } from './components/retailer/RetailerDashboard';
import { WarehouseDashboard } from './components/warehouse/WarehouseDashboard';

type Role = 'company' | 'retailer' | 'warehouse' | null;

function App() {
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

  if (selectedRole === 'company') {
    return <CompanyDashboard onBack={handleBack} />;
  }

  if (selectedRole === 'retailer') {
    return <RetailerDashboard onBack={handleBack} />;
  }

  if (selectedRole === 'warehouse') {
    return <WarehouseDashboard onBack={handleBack} />;
  }

  return <LandingPage onSelectRole={handleSelectRole} />;
}

export default App;
