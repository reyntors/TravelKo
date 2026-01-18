import CoordinatorNav from "../../components/coordinatorNav";

export default function CoordinatorLayout({ children }) {
  return (
    <>
      <CoordinatorNav />
      <div style={{ paddingTop: 20, paddingLeft: 70 }}>
        {children}
      </div>
    </>
  );
}
