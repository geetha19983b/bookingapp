
import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewItemForm from './NewItemForm';
import ItemList from './ItemList';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-main">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navbar */}
          <TopNavbar />
          
          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<ItemList />} />
              <Route path="/add" element={<NewItemForm />} />
              <Route path="/home" element={<div className="p-8"><h1 className="text-2xl font-semibold text-primary">Welcome to Books</h1><p className="text-secondary mt-2">Select an option from the sidebar to get started.</p></div>} />
              <Route path="/inventory" element={<div className="p-8"><h1 className="text-2xl font-semibold text-primary">Inventory</h1></div>} />
              <Route path="/sales" element={<div className="p-8"><h1 className="text-2xl font-semibold text-primary">Sales</h1></div>} />
              <Route path="/purchases" element={<div className="p-8"><h1 className="text-2xl font-semibold text-primary">Purchases</h1></div>} />
              <Route path="/time-tracking" element={<div className="p-8"><h1 className="text-2xl font-semibold text-primary">Time Tracking</h1></div>} />
              <Route path="/banking" element={<div className="p-8"><h1 className="text-2xl font-semibold text-primary">Banking</h1></div>} />
              <Route path="/compliance" element={<div className="p-8"><h1 className="text-2xl font-semibold text-primary">Filing & Compliance</h1></div>} />
              <Route path="/accountant" element={<div className="p-8"><h1 className="text-2xl font-semibold text-primary">Accountant</h1></div>} />
              <Route path="/reports" element={<div className="p-8"><h1 className="text-2xl font-semibold text-primary">Reports</h1></div>} />
              <Route path="/documents" element={<div className="p-8"><h1 className="text-2xl font-semibold text-primary">Documents</h1></div>} />
              <Route path="/payroll" element={<div className="p-8"><h1 className="text-2xl font-semibold text-primary">Zoho Payroll</h1></div>} />
              <Route path="/payments" element={<div className="p-8"><h1 className="text-2xl font-semibold text-primary">Zoho Payments</h1></div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App