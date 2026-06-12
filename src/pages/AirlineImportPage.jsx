import React, { useState } from "react";
import { xmlToObject } from "../utils/XMLUtils";
import { OODBMSFirestore } from "../utils/OODBMSFirestore";
import { projectConfig } from "../projectConfig";

const dbms = new OODBMSFirestore(projectConfig);

const AirlineImportPage = () => {
  const [parsedData, setParsedData] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const text = await file.text();
    const obj = xmlToObject(text);
    setParsedData(obj);
  };

  const handleSaveToFirestore = async () => {
    if (!parsedData) return;

    const staffData =
      parsedData?.[projectConfig.airlineRootXML]?.staffList?.staff;

    const staffArray = Array.isArray(staffData)
      ? staffData
      : staffData
      ? [staffData]
      : [];

    for (const staff of staffArray) {
      await dbms.create(projectConfig.airlineCollection, staff);
    }

    alert("✅ Airline Data Imported Successfully!");
  };

  const renderStaff = () => {
    const staffData =
      parsedData?.[projectConfig.airlineRootXML]?.staffList?.staff;

    const staffArray = Array.isArray(staffData)
      ? staffData
      : staffData
      ? [staffData]
      : [];

    if (!staffArray.length)
      return <p className="text-gray-600 italic">No staff found in XML.</p>;

    return staffArray.map((s, i) => (
      <div key={i} className="border-b border-blue-200 py-3 mb-3">
        <h3 className="font-semibold text-blue-700">
          {s.name} ({s.staffId})
        </h3>
        <p>🛎 Counter: {s.counterNo || "N/A"}</p>
        <p>⏰ Shift: {s.shift || "N/A"}</p>

        {s.passengers && (
          <div className="mt-2">
            <p className="font-semibold">🧍 Passengers:</p>
            {(Array.isArray(s.passengers) ? s.passengers : [s.passengers]).map(
              (p, j) => (
                <div key={j} className="ml-4 border-l pl-3 my-1">
                  <strong>{p.name}</strong> — Ticket {p.ticketNo} — ✈{" "}
                  {p.flight?.number}
                  <br />
                  <span className="text-sm text-gray-600">
                    {p.flight?.source} → {p.flight?.destination} ({p.flight?.date} {p.flight?.time})
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-blue-100 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-lg border border-blue-300">

        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          📥 Import Airline XML Data
        </h1>

        <input
          type="file"
          accept=".xml"
          onChange={handleFileUpload}
          className="w-full border border-blue-400 bg-blue-50 p-2 rounded-lg mb-4"
        />

        {fileName && (
          <p className="text-sm text-gray-600 mb-4">
            Selected File: <strong>{fileName}</strong>
          </p>
        )}

        {parsedData ? (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">
              Parsed Staff & Passengers
            </h2>
            {renderStaff()}
          </div>
        ) : (
          <p className="text-gray-500 italic text-center">
            No XML imported yet.
          </p>
        )}

        {parsedData && (
          <button
            onClick={handleSaveToFirestore}
           
          >
                     
          </button>
        )}
      </div>
    </div>
  );
};

export default AirlineImportPage;
