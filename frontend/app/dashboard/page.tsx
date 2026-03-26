"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Complaint = {
  id: string;
  citizen_name: string;
  title: string;
  category: string;
  department: string;
  zone?: string | null;
  status: string;
  created_at: string;
  address?: string | null;
  maps_link?: string | null;
};

type StatusFilter = "all" | "submitted" | "in-progress" | "resolved";

export default function Dashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const router = useRouter();

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  fetchComplaints();
}, [router]);

  const fetchComplaints = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await axios.get(`${API_URL}/complaints`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setComplaints(res.data);
  } catch (error: any) {
    console.error("Failed to fetch complaints:", error);

    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      router.push("/login");
    }
  } finally {
    setLoading(false);
  }
};

  const totalComplaints = complaints.length;
  const submittedCount = complaints.filter((c) => c.status === "submitted").length;
  const inProgressCount = complaints.filter((c) => c.status === "in-progress").length;
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length;

  const filteredComplaints = useMemo(() => {
    if (statusFilter === "all") return complaints;
    return complaints.filter((c) => c.status === statusFilter);
  }, [complaints, statusFilter]);

  const departmentsToShow = [
    "Roads Department",
    "Electrical Department",
    "Sanitation Department",
    "Drainage Department",
    "Water Works Department",
    "Traffic Police",
    "Municipal Administration",
    "General Administration",
  ];

  const departmentRoutes: Record<string, string> = {
    "Roads Department": "roads",
    "Electrical Department": "electrical",
    "Sanitation Department": "sanitation",
    "Drainage Department": "drainage",
    "Water Works Department": "water-works",
    "Traffic Police": "traffic-police",
    "Municipal Administration": "municipal-administration",
    "General Administration": "general-administration",
  };

  const departmentCardStyles: Record<string, string> = {
    "Roads Department": "bg-orange-50 border-orange-200 text-orange-800",
    "Electrical Department": "bg-yellow-50 border-yellow-200 text-yellow-800",
    "Sanitation Department": "bg-emerald-50 border-emerald-200 text-emerald-800",
    "Drainage Department": "bg-cyan-50 border-cyan-200 text-cyan-800",
    "Water Works Department": "bg-blue-50 border-blue-200 text-blue-800",
    "Traffic Police": "bg-purple-50 border-purple-200 text-purple-800",
    "Municipal Administration": "bg-pink-50 border-pink-200 text-pink-800",
    "General Administration": "bg-slate-50 border-slate-200 text-slate-800",
  };

  const zonesToShow = [
    "Central Hyderabad",
    "North Hyderabad",
    "East Hyderabad",
    "Secunderabad",
    "South Hyderabad",
    "West Hyderabad",
  ];

  const zoneCardStyles: Record<string, string> = {
    "Central Hyderabad": "bg-indigo-50 border-indigo-200 text-indigo-800",
    "North Hyderabad": "bg-violet-50 border-violet-200 text-violet-800",
    "East Hyderabad": "bg-sky-50 border-sky-200 text-sky-800",
    "Secunderabad": "bg-cyan-50 border-cyan-200 text-cyan-800",
    "South Hyderabad": "bg-rose-50 border-rose-200 text-rose-800",
    "West Hyderabad": "bg-emerald-50 border-emerald-200 text-emerald-800",
  };

  const departmentCounts: Record<string, number> = complaints.reduce((acc, complaint) => {
    const dept = complaint.department || "General Administration";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const zoneCounts: Record<string, number> = complaints.reduce((acc, complaint) => {
    const zone = complaint.zone || "Unknown";
    acc[zone] = (acc[zone] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 bg-gradient-to-r from-sky-900 via-cyan-800 to-emerald-700 text-white rounded-2xl px-6 py-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="bg-white/95 rounded-xl p-2 shadow-lg">
                  <Image
                    src="/CM.JPG"
                    alt="Chief Minister"
                    width={70}
                    height={70}
                    className="object-cover rounded-full border-2 border-white"
                    priority
                  />
                </div>
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-sky-100 font-semibold">
                  Telangana Governance Platform
                </p>
                <h1 className="text-3xl md:text-4xl font-bold mt-1">
                  Officer Dashboard
                </h1>
                <p className="text-sky-50 mt-1">
                  Hyderabad-only complaint monitoring, department routing, and zone-wise analysis.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
  <button
    onClick={() => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      router.push("/login");
    }}
    className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
  >
    Logout
  </button>

  <div className="bg-white/95 rounded-xl p-3 shadow-lg">
    <Image
      src="/logo.PNG"
      alt="Government Logo"
      width={90}
      height={90}
      className="object-contain"
      priority
    />
  </div>
</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Complaints</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">{totalComplaints}</h2>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-red-700">Submitted</p>
            <h2 className="text-3xl font-bold text-red-800 mt-2">{submittedCount}</h2>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-amber-700">In Progress</p>
            <h2 className="text-3xl font-bold text-amber-800 mt-2">{inProgressCount}</h2>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-green-700">Resolved</p>
            <h2 className="text-3xl font-bold text-green-800 mt-2">{resolvedCount}</h2>
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Zone-wise Complaints</h2>
            <p className="text-slate-600 mt-1">
              Hyderabad zone distribution for all registered complaints.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {zonesToShow.map((zone) => (
              <div
                key={zone}
                className={`rounded-2xl border p-5 shadow-sm ${
                  zoneCardStyles[zone] || "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                <p className="text-sm font-medium">{zone}</p>
                <h3 className="text-3xl font-bold mt-2">{zoneCounts[zone] || 0}</h3>
                <p className="text-xs mt-2 opacity-80">complaints registered</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Department-wise Complaints</h2>
            <p className="text-slate-600 mt-1">
              Click any department to open its dedicated complaint page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {departmentsToShow.map((department) => (
              <Link
                key={department}
                href={`/dashboard/departments/${departmentRoutes[department]}`}
                className={`rounded-2xl border p-5 shadow-sm text-left transition transform hover:scale-[1.01] ${
                  departmentCardStyles[department] || "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                <p className="text-sm font-medium">{department}</p>
                <h3 className="text-3xl font-bold mt-2">{departmentCounts[department] || 0}</h3>
                <p className="text-xs mt-2 opacity-80">complaints registered</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Complaints Overview
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {statusFilter === "all"
                  ? "Showing complaints for all Hyderabad zones and departments"
                  : `Showing ${statusFilter} complaints only`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold text-slate-700">
                {filteredComplaints.length} complaint{filteredComplaints.length !== 1 ? "s" : ""}
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:border-cyan-600"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-slate-600">Loading complaints...</div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-6 text-slate-600">
              No complaints found for the selected status.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1400px]">
                <thead className="bg-slate-50">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">ID</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Citizen</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Title</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Category</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Department</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Zone</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Address</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Map Link</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Created At</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredComplaints.map((c) => (
                    <tr key={c.id} className="border-t border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-900 font-medium">{c.id}</td>
                      <td className="px-6 py-4 text-slate-800">{c.citizen_name}</td>
                      <td className="px-6 py-4 text-slate-800">{c.title}</td>
                      <td className="px-6 py-4 text-slate-800">{c.category}</td>
                      <td className="px-6 py-4 text-slate-800">{c.department}</td>
                      <td className="px-6 py-4 text-slate-800">{c.zone || "Unknown"}</td>
                      <td className="px-6 py-4 text-slate-700 max-w-xs">
                        <div className="whitespace-normal break-words">
                          {c.address || "Not provided"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {c.maps_link ? (
                          <a
                            href={c.maps_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-lg bg-sky-100 px-3 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-200"
                          >
                            Open Map
                          </a>
                        ) : (
                          <span className="text-slate-500">Not provided</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={c.status}
                          onChange={async (e) => {
                            await axios.put(
                              `${API_URL}/complaints/${c.id}/status`,
                              null,
                              { params: { status: e.target.value },
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                              }
                            );
                            fetchComplaints();
                          }}
                          className={`rounded-lg border px-3 py-2 text-sm font-semibold outline-none ${
                            c.status === "resolved"
                              ? "border-green-300 bg-green-100 text-green-800"
                              : c.status === "in-progress"
                              ? "border-amber-300 bg-amber-100 text-amber-800"
                              : "border-red-300 bg-red-100 text-red-800"
                          }`}
                        >
                          <option value="submitted">submitted</option>
                          <option value="in-progress">in-progress</option>
                          <option value="resolved">resolved</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {new Date(c.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}