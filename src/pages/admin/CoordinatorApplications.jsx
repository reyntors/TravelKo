const applications = [
  {
    id: 1,
    name: "Pedro Santos",
    email: "pedro@email.com",
    phone: "09123456789",
  },
];

export default function CoordinatorApplications() {
  return (
    <>
      <h3 className="fw-bold mb-3">Coordinator Applications</h3>

      {applications.map((a) => (
        <div key={a.id} className="card p-3 mb-3 shadow-sm">
          <strong>{a.name}</strong>
          <div>{a.email}</div>
          <div>{a.phone}</div>

          <div className="mt-3">
            <button className="btn btn-success btn-sm me-2">Approve</button>
            <button className="btn btn-danger btn-sm">Decline</button>
          </div>
        </div>
      ))}
    </>
  );
}
