import { useNavigate } from "react-router-dom";

const coordinators = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    email: "juan@email.com",
    tours: 5,
    status: "Active",
  },
];

export default function ManageCoordinators() {
  const navigate = useNavigate(); // ✅ FIX #1

  return (
    <>
      <h3 className="fw-bold mb-3">Manage Coordinators</h3>

      <table className="table shadow-sm bg-white">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Tours</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {coordinators.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.tours}</td>
              <td>{c.status}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={() => navigate(`/admin/coordinator/${c.id}`)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
