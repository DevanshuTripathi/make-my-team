export default function DashboardLayout({ children }) {
    return (
      <div className="dashboard-layout">
        <nav>Dashboard Navigation</nav>
        <main>{children}</main>
      </div>
    );
  }
  
