import axios from "axios";
// Update the import path to the correct location of the 'Report' type
import type { Report } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchFlaggedReports = async (): Promise<Report[]> => {
  const res = await axios.get<Report[]>(`${API_URL}/flagged`);
  return res.data;
};

export const downloadCSV = () => {
  window.open(`${API_URL}/report/csv`, "_blank");
};

export const downloadPDF = () => {
  window.open(`${API_URL}/report/pdf`, "_blank");
};

