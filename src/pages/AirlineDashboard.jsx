import React, { useState, useEffect } from "react";
import { OODBMSFirestore } from "../utils/OODBMSFirestore";
import { objectToXML } from "../utils/XMLUtils";
import { projectConfig } from "../projectConfig";
import { AirlineStaff } from "../models/AirlineModels";

const dbms = new OODBMSFirestore(projectConfig);

const AirlineDashboard = () => {
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({
    name: "",
    staffId: "",
    counterNo: "",
    shift: ""
  });

  const [passengers, setPassengers] = useState([]);
  const [newPassenger, setNewPassenger] = useState({
    name: "",
    age: "",
    ticketNo: "",
    flightNumber: "",
    source: "",
    destination: "",
    date: "",
    time: ""
  });

  const loadData = async () => {
    const data = await dbms.getAll(projectConfig.airlineCollection);
    setStaffList(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePassengerChange = (e) =>
    setNewPassenger({ ...newPassenger, [e.target.name]: e.target.value });

  const addPassenger = () => {
    if (!newPassenger.name || !newPassenger.flightNumber || !newPassenger.ticketNo)
      return alert("Enter passenger name, ticket number & flight number.");

    setPassengers([...passengers, newPassenger]);
    setNewPassenger({
      name: "",
      age: "",
      ticketNo: "",
      flightNumber: "",
      source: "",
      destination: "",
      date: "",
      time: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.staffId) return alert("Enter staff details");

    const staff = new AirlineStaff(
      form.name,
      form.staffId,
      form.counterNo,
      form.shift
    );

    passengers.forEach(p =>
      staff.addPassenger(
        p.name,
        p.age,
        p.ticketNo,
        p.flightNumber,
        p.source,
        p.destination,
        p.date,
        p.time
      )
    );

    await dbms.create(projectConfig.airlineCollection, staff.toJSON());

    setForm({ name: "", staffId: "", counterNo: "", shift: "" });
    setPassengers([]);
    loadData();
  };

  const exportXML = () => {
    if (!staffList.length) return alert("No data to export");
    const xml = objectToXML(
      { staffList: { staff: staffList } },
      projectConfig.airlineRootXML
    );
    const blob = new Blob([xml], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "airline_data.xml";
    link.click();
  };

  return (
    <div className="min-h-screen bg-blue-100 py-10">
      <div className=" mx-auto bg-white p-8   border-blue-300">

        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
         Airline Staff Management
        </h1>

        {/* Staff Form */}
        <form onSubmit={handleSubmit} className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">➕ Add Airline Staff</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Staff Name" className="p-2 border rounded"/>
            <input name="staffId" value={form.staffId} onChange={handleChange} placeholder="Staff ID (e.g. ST-202)" className="p-2 border rounded"/>
            <input name="counterNo" value={form.counterNo} onChange={handleChange} placeholder="Counter Number (e.g. C-12)" className="p-2 border rounded"/>
            <input name="shift" value={form.shift} onChange={handleChange} placeholder="Shift (Morning / Evening)" className="p-2 border rounded"/>
          </div>

          {/* Passenger Input */}
          <div className="mt-8 bg-white p-5 rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-3">🧍 Add Passenger</h3>

            <div className="grid md:grid-cols-4 gap-3 mb-3">
              <input name="name" value={newPassenger.name} onChange={handlePassengerChange} placeholder="Passenger Name" className="p-2 border rounded"/>
              <input name="age" value={newPassenger.age} onChange={handlePassengerChange} placeholder="Age" className="p-2 border rounded"/>
              <input name="ticketNo" value={newPassenger.ticketNo} onChange={handlePassengerChange} placeholder="Ticket No" className="p-2 border rounded"/>
              <input name="flightNumber" value={newPassenger.flightNumber} onChange={handlePassengerChange} placeholder="Flight Number" className="p-2 border rounded"/>
            </div>

            <div className="grid md:grid-cols-4 gap-3 mb-3">
              <input name="source" value={newPassenger.source} onChange={handlePassengerChange} placeholder="Source" className="p-2 border rounded"/>
              <input name="destination" value={newPassenger.destination} onChange={handlePassengerChange} placeholder="Destination" className="p-2 border rounded"/>
              <input name="date" value={newPassenger.date} onChange={handlePassengerChange} placeholder="Date (YYYY-MM-DD)" className="p-2 border rounded"/>
              <input name="time" value={newPassenger.time} onChange={handlePassengerChange} placeholder="Time (e.g. 14:30)" className="p-2 border rounded"/>
            </div>

            <button type="button" onClick={addPassenger} className="bg-blue-600 text-white px-3 py-1 rounded">
              + Add Passenger
            </button>

            {passengers.length > 0 && (
              <ul className="mt-4 list-disc ml-4">
                {passengers.map((p, i) => (
                  <li key={i}>{p.name} — {p.ticketNo} — Flight {p.flightNumber}</li>
                ))}
              </ul>
            )}
          </div>

          <button type="submit" className="mt-6 bg-blue-700 text-white px-5 py-2 rounded">💾 Save Staff</button>
        </form>

        {/* Display Section */}
        <h2 className="text-xl font-semibold text-blue-800 mb-3">📋 Airline Staff & Passengers</h2>

        {staffList.length === 0 ? (
          <p>No records yet.</p>
        ) : (
          <div className="overflow-x-auto border rounded-xl shadow-sm">
            <table className="w-full border-collapse">
              <thead className="bg-blue-200">
                <tr>
                  <th className="p-3">Staff</th>
                  <th className="p-3">Counter</th>
                  <th className="p-3">Passengers</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="p-3">{s.name} ({s.staffId})</td>
                    <td className="p-3">{s.counterNo} — {s.shift}</td>
                    <td className="p-3">
                      {(s.passengers || []).map((p, i) => (
                        <div key={i} className="py-1 border-b">
                          🧍 {p.name} — Ticket {p.ticketNo} — ✈ {p.flight?.number}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-center mt-6">
          <button onClick={exportXML} className="bg-blue-700 text-white px-6 py-2 rounded">
            📤 Export as XML
          </button>
        </div>
      </div>
    </div>
  );
};

export default AirlineDashboard;
