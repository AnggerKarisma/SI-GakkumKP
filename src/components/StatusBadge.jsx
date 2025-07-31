const StatusBadge = ({ status }) => {
  const statusStyle = {
    Ready: "text-green-500",
    Used: "text-yellow-500",
    Unready: "text-red-500",
  };
  return (
    <span className={`font-semibold ${statusStyle[status] || "text-white"}`}>
      {status}
    </span>
  );
};

export default StatusBadge;