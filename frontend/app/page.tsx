"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type ComplaintResult = {
  id: string;
  citizen_name: string;
  phone?: string;
  email?: string;
  title: string;
  description: string;
  address?: string;
  maps_link?: string;
  category?: string;
  department?: string;
  zone?: string;
  status: string;
  created_at: string;
};

type TrackResult = {
  id: string;
  status: string;
  created_at: string;
};

export default function Home() {
  const [form, setForm] = useState({
    citizen_name: "",
    phone: "",
    email: "",
    title: "",
    description: "",
    address: "",
    maps_link: "",
  });

  const [result, setResult] = useState<ComplaintResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [trackId, setTrackId] = useState("");
  const [trackResult, setTrackResult] = useState<TrackResult | null>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        citizen_name: form.citizen_name,
        phone: form.phone || null,
        email: form.email || null,
        title: form.title,
        description: form.description,
        address: form.address || null,
        maps_link: form.maps_link || null,
      };

      const res = await axios.post(`${API_URL}/complaints`, payload);
      setResult(res.data);

      setForm({
        citizen_name: "",
        phone: "",
        email: "",
        title: "",
        description: "",
        address: "",
        maps_link: "",
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Failed to submit complaint. Check backend or network settings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTrackComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackLoading(true);
    setTrackError("");
    setTrackResult(null);

    try {
      const cleanedTrackId = trackId.trim().toUpperCase();
      const res = await axios.get(
        `${API_URL}/complaints/${cleanedTrackId}`
      );

      setTrackResult({
        id: res.data.id,
        status: res.data.status,
        created_at: res.data.created_at,
      });
    } catch (err) {
      setTrackError("Complaint not found. Please check the complaint ID.");
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
<div className="bg-gradient-to-r from-sky-900 via-cyan-800 to-emerald-700 text-white">
  <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">

    {/* LEFT SIDE: CM + TEXT */}
    <div className="flex items-center gap-4 md:items-center">
      
      {/* CM Image */}
      <div className="bg-white/95 rounded-xl p-2 shadow-lg">
        <Image
          src="/CM.JPG"
          alt="Chief Minister"
          width={80}
          height={80}
          className="object-cover rounded-lg"
          priority
        />
      </div>

      {/* TEXT */}
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-sky-100 font-semibold">
          Telangana Governance Platform
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">
          Praja Palana Portal
        </h1>
        <p className="mt-3 max-w-3xl text-sky-50 text-lg">
          Submit and track civic complaints through an AI-assisted governance workflow.
        </p>
      </div>
    </div>

    {/* RIGHT SIDE: LOGO */}
    <div className="flex-shrink-0 self-start md:self-center">
      <div className="bg-white/95 rounded-xl p-3 shadow-lg">
        <Image
          src="/logo.PNG"
          alt="Government Logo"
          width={110}
          height={110}
          className="h-auto w-[90px] md:w-[110px] object-contain"
          priority
        />
      </div>
    </div>

  </div>
</div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmitComplaint}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-5"
            >
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  Register a Complaint
                </h2>
                <p className="text-slate-600 mt-1">
                  Enter complaint details below. The system will classify the
                  issue and assign it to the appropriate department.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Citizen Name
                </label>
                <input
                  name="citizen_name"
                  placeholder="Enter full name"
                  value={form.citizen_name}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  name="phone"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Complaint Title
                </label>
                <input
                  name="title"
                  placeholder="Enter short title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Complaint Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe the issue in detail"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-3 h-36 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  placeholder="Enter complaint location/address including pincode."
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-3 h-24 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Google Maps Location Link
                </label>
                <input
                  name="maps_link"
                  placeholder="Paste Google Maps link"
                  value={form.maps_link}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-sky-900 hover:bg-sky-800 text-white px-8 py-3 rounded-lg font-semibold shadow-sm transition disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                  {error}
                </div>
              )}
            </form>

            {result && (
              <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-200 pb-4 mb-5">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Complaint Submitted Successfully
                    </h2>
                    <p className="text-slate-600 mt-1">
                      Your complaint has been registered and routed for review.
                    </p>
                  </div>

                  <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-4 py-2 text-sm font-semibold">
                    {result.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-slate-500">Complaint ID</p>
                    <p className="text-slate-900 font-semibold mt-1">
                      {result.id}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-slate-500">Citizen Name</p>
                    <p className="text-slate-900 font-semibold mt-1">
                      {result.citizen_name}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-slate-500">Category</p>
                    <p className="text-slate-900 font-semibold mt-1">
                      {result.category}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-slate-500">Department</p>
                    <p className="text-slate-900 font-semibold mt-1">
                      {result.department}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-slate-500">Zone</p>
                    <p className="text-slate-900 font-semibold mt-1">
                      {result.zone}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Track Your Complaint
              </h3>

              <form onSubmit={handleTrackComplaint} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Complaint ID
                  </label>
                  <input
                    type="text"
                    placeholder="Enter complaint ID (e.g. HYD-A1B2C3D4)"
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value.toUpperCase())}
                    className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50 text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={trackLoading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-lg font-semibold shadow-sm transition disabled:opacity-60"
                >
                  {trackLoading ? "Tracking..." : "Track Complaint"}
                </button>

                {trackError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                    {trackError}
                  </div>
                )}
              </form>
            </div>

            {trackResult && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Complaint Status
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-slate-500">Complaint ID</p>
                    <p className="text-slate-900 font-semibold mt-1">
                      {trackResult.id}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-slate-500">Date of Complaint Issued</p>
                    <p className="text-slate-900 font-semibold mt-1">
                      {new Date(trackResult.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-slate-500">Status of Complaint</p>
                    <p className="text-slate-900 font-semibold mt-1 capitalize">
                      {trackResult.status}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Submission Guidance
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>Provide a clear and specific complaint title.</li>
                <li>Describe the issue location and severity in detail.</li>
                <li>Enter a valid Hyderabad address for complaint registration.</li>
                <li>
                  Paste a Google Maps location link for accurate location
                  identification.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}