import fs from "fs/promises";

type Row = Record<string, string | number | boolean | null | undefined>;

export async function writeCsvRow(path: string, row: Row) {
  const header = Object.keys(row);
  const exists = await fileExists(path);
  const line = toCsvLine(header, row);
  if (!exists) {
    await fs.writeFile(path, header.join(",") + "\n" + line + "\n", "utf8");
  } else {
    await fs.appendFile(path, line + "\n", "utf8");
  }
}

async function fileExists(p: string) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

function toCsvLine(header: string[], row: Row) {
  const esc = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  return header.map((k) => esc(row[k])).join(",");
}
