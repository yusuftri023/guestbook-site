export default function GuestCount({
  count,
}: {
  count: {
    total: number;
    present: number;
  };
}) {
  return (
    <div className="mb-4 space-y-4 rounded-md border border-gray-300 bg-white px-4 py-4 text-center text-2xl font-bold text-gray-800">
      <h2>Pengunjung Hadir</h2>
      <p>
        <span className="text-green-500">{count.present}</span> / {count.total}
      </p>
    </div>
  );
}
