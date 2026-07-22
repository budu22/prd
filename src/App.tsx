import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CustomerGroups from './pages/CustomerGroups';
import CustomerGroupCreate from './pages/CustomerGroups/Create';
import CustomerGroupDetail from './pages/CustomerGroups/Detail';
import Strategy from './pages/Strategy';
import StrategyCreate from './pages/Strategy/Create';
import Events from './pages/Events';
import Channels from './pages/Channels';
import Content from './pages/Content';
import Products from './pages/Products';
import Benefits from './pages/Benefits';
import Activities from './pages/Activities';
import Analytics from './pages/Analytics';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customer-groups" element={<CustomerGroups />} />
        <Route path="/customer-groups/create" element={<CustomerGroupCreate />} />
        <Route path="/customer-groups/:id" element={<CustomerGroupDetail />} />
        <Route path="/strategy" element={<Strategy />} />
        <Route path="/strategy/create" element={<StrategyCreate />} />
        <Route path="/events" element={<Events />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/content" element={<Content />} />
        <Route path="/products" element={<Products />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}