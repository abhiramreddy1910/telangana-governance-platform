"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

type Complaint = {
  id: string;
  citizen_name: string;
  title: string;
  category: string;
  department: string;
  status: string;
  created_at: string;
  address?: string | null;
  maps_link?: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const slugToDepartment: Record<string, string> = {
  roads: "Roads Department",
  electrical: "Electrical Department",
  sanitation: "Sanitation Department",
  drainage: "Drainage Department",
  "water-works": "Water Works Department",
  "traffic-police": "Traffic Police",
  "municipal-administration": "Municipal Administration",
  "general-administration": "General Administration",
};

const departmentTheme: Record<string, string> = {
  "Roads Department": "bg-orange-50 border-orange-200 text-orange-800",
  "Electrical Department": "bg-yellow-50 border-yellow-200 text-yellow-800",
  "Sanitation Department": "bg-emerald-50 border-emerald-200 text-emerald-800",
  "Drainage Department": "bg-cyan-50 border-cyan-200 text-cyan-800",
  "Water Works Department": "bg-blue-50 border-blue-200 text-blue-800",
  "Traffic Police": "bg-purple-50 border-purple-200 text-purple-800",
  "Municipal Administration": "bg-pink-50 border-pink-200 text-pink-800",
  "General Administration": "bg-slate-50 border-slate-200 text-slate-800",
};

export default function DepartmentPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const departmentName = slugToDepartment[slug] || "Unknown Department";

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchComplaints();
  }, [router]);

  const departmentComplaints = useMemo(() => {
    return complaints.filter((c) => c.department === departmentName);
  }, [complaints, departmentName]);

  const totalCount = departmentComplaints.length;
  const submittedCount = departmentComplaints.filter((c) => c.status === "submitted").length;
  const inProgressCount = departmentComplaints.filter((c) => c.status === "in-progress").length;
  const resolvedCount = departmentComplaints.filter((c) => c.status === "resolved").length;

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 bg-gradient-to-r from-sky-900 via-cyan-800 to-emerald-700 text-white rounded-2xl px-6 py-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/95 rounded-xl p-2 shadow-lg">
                <Image
                  src="/CM.jpg"
                  alt="Chief Minister"
                  width={70}
                  height={70}
                  className="object-cover rounded-full border-2 border-white"
                  priority
                />
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-sky-100 font-semibold">
                  Telangana Governance Platform
                </p>
                <h1 className="text-3xl md:text-4xl font-bold mt-1">
                  {departmentName}
                </h1>
                <p className="text-sky-50 mt-1">
                  Department-specific complaint monitoring and status overview.
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
                  src="/logo.png"
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

        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div
          className={`rounded-2xl border p-5 shadow-sm mb-8 ${
            departmentTheme[departmentName] || "bg-white border-slate-200 text-slate-800"
          }`}
        >
          <p className="text-sm font-medium">Selected Department</p>
          <h2 className="text-3xl font-bold mt-2">{departmentName}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Complaints Registered</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">{totalCount}</h2>
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

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Complaint Details
            </h2>
            <span className="text-sm font-semibold text-slate-700">
              {totalCount} complaint{totalCount !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="p-6 text-slate-600">Loading complaints...</div>
          ) : departmentComplaints.length === 0 ? (
            <div className="p-6 text-slate-600">
              No complaints found for this department.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead className="bg-slate-50">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">ID</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Citizen</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Title</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Category</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Address</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Map Link</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Created At</th>
                  </tr>
                </thead>

                <tbody>
                  {departmentComplaints.map((c) => (
                    <tr key={c.id} className="border-t border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-900 font-medium">{c.id}</td>
                      <td className="px-6 py-4 text-slate-800">{c.citizen_name}</td>
                      <td className="px-6 py-4 text-slate-800">{c.title}</td>
                      <td className="px-6 py-4 text-slate-800">{c.category}</td>
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
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                            c.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : c.status === "in-progress"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {c.status}
                        </span>
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