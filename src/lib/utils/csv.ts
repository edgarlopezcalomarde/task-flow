export const createCSV = (
  headers: Array<string>,
  matrix: Array<Array<string>>
) => {
  const rows = matrix.map((r) => r.join(";"));
  return `${headers.join(";")}\n${rows.join("\n")}`;
};
