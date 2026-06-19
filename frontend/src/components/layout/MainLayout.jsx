import Sidebar from "./Sidebar";
import Header from "./Header";

import "./layout.css";

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Sidebar />

      <div className="layout-content">
        <Header />

        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}

export default MainLayout;
