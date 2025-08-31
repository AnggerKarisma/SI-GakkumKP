
const DetailField = ({ label, value }) => (
  <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4">
    <p className="text-sm text-gray-300 md:w-2/5">{label}</p>
    <p className="text-base text-white  md:w-3/5">{value || "-"}</p>
  </div>
);

const FieldAkun = ({ title, fields, data = {} }) => {
  const middleIndex = Math.ceil(fields.length / 2);
  const firstColumnFields = fields.slice(0, middleIndex);
  const secondColumnFields = fields.slice(middleIndex);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 border-2 border-gray-600 rounded-xl">
      <p className="text-lg font-semibold text-white">{title}</p>
      <div className="flex flex-col md:flex-row gap-x-8">
        {/* Kolom Pertama */}
        <div className="flex flex-col gap-y-4 w-full md:w-1/2">
          {firstColumnFields.map((field) => (
            <DetailField
              key={field.id}
              label={field.label}
              value={data[field.id]}
            />
          ))}
        </div>
        <div className="flex flex-col gap-y-4 w-full md:w-1/2">
          {secondColumnFields.map((field) => (
            <DetailField
              key={field.id}
              label={field.label}
              value={data[field.id]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldAkun;
