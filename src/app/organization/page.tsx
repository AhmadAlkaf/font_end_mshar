"use client";

import React, { useState, useEffect } from "react";
import {
  Network,
  Users,
  Briefcase,
  ChevronDown,
  ChevronRight,
  FolderTree,
  Plus,
  Building,
  UserCheck,
  Shield,
  Layers,
} from "lucide-react";
import { api } from "@/services/api";
import { OrganizationalStructure, JobTitle, EducationalLevel } from "@/types/hr";

export default function OrganizationPage() {
  const [tree, setTree] = useState<OrganizationalStructure[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [educationalLevels, setEducationalLevels] = useState<EducationalLevel[]>([]);
  const [activeTab, setActiveTab] = useState<"structure" | "jobs" | "education">("structure");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [org, jobs, edu] = await Promise.all([
          api.organization.getTree(),
          api.organization.getJobTitles(),
          api.organization.getEducationalLevels(),
        ]);
        setTree(org);
        setJobTitles(jobs);
        setEducationalLevels(edu);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: OrganizationalStructure, level: number = 0) => {
    return (
      <div key={node.id} className="space-y-3">
        <div
          className={`p-4 rounded-2xl border transition-all ${
            level === 0
              ? "bg-gradient-to-l from-purple-50 to-white border-purple-200 shadow-sm"
              : "bg-white border-slate-200/90 hover:border-purple-200"
          }`}
          style={{ marginRight: `${level * 24}px` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                  level === 0
                    ? "bg-[#5B21B6] text-white shadow-md shadow-purple-900/20"
                    : "bg-purple-100 text-[#5B21B6]"
                }`}
              >
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{node.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{node.descriptions}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {node.manger && node.manger.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-purple-900 bg-purple-50 px-3 py-1 rounded-xl border border-purple-100">
                  <UserCheck className="w-3.5 h-3.5 text-[#5B21B6]" />
                  <span>
                    المدير:{" "}
                    {typeof node.manger[0] === "object"
                      ? `${node.manger[0].first_name} ${node.manger[0].last_name}`
                      : "المشرف الإداري"}
                  </span>
                </div>
              )}
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                مستوى {level + 1}
              </span>
            </div>
          </div>
        </div>

        {/* Children Render */}
        {node.children && node.children.length > 0 && (
          <div className="border-r-2 border-purple-200 pr-4 space-y-3 mr-4">
            {node.children.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Network className="w-7 h-7 text-[#5B21B6]" />
            <span>الهيكل الإداري والمسميات الوظيفية</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            شجرة الهيكل التنظيمي (MPTT)، المسميات الوظيفية، وشرح المهام
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/60 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("structure")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "structure"
              ? "bg-white text-[#4C1D95] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>الهيكل الإداري (MPTT)</span>
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "jobs"
              ? "bg-white text-[#4C1D95] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>المسميات الوظيفية والمهام ({jobTitles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("education")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "education"
              ? "bg-white text-[#4C1D95] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>المستويات التعليمية ({educationalLevels.length})</span>
        </button>
      </div>

      {/* Tab 1: MPTT Org Structure Tree */}
      {activeTab === "structure" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                مخطط الشجرة الإدارية (Organizational Structure)
              </h3>
              <p className="text-xs text-slate-400">
                تسلسل الإدارات، الأقسام، والمشرفين المعتمدين في النظام
              </p>
            </div>
          </div>

          <div className="pt-2 space-y-4">
            {tree.map((rootNode) => renderTreeNode(rootNode, 0))}
          </div>
        </div>
      )}

      {/* Tab 2: Job Titles with Tasks */}
      {activeTab === "jobs" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobTitles.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:border-purple-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5B21B6] flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{job.name}</h3>
                    <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-semibold">
                      مسمى وظيفي معتمد
                    </span>
                  </div>
                </div>

                <div className="py-4">
                  <h4 className="text-xs font-bold text-slate-700 mb-1">
                    شرح المهام والمسؤوليات الوظيفية:
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    {job.tesk}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>كود الوظيفة: JOB-00{job.id}</span>
                <span className="text-emerald-600 font-semibold">نشطة</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Educational Levels */}
      {activeTab === "education" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="font-bold text-slate-800 text-base mb-4">
            المستويات التعليمية المسجلة
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {educationalLevels.map((lvl) => (
              <div
                key={lvl.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#4C1D95] flex items-center justify-center font-bold">
                  {lvl.id}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">{lvl.name}</h4>
                  <span className="text-[10px] text-slate-400">مؤهل معتمد</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
