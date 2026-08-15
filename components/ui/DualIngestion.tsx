"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Briefcase,
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileCode,
  File,
} from "lucide-react";
import { PiiSanitizationResult } from "@/lib/types/evaluation";

interface DualIngestionProps {
  resumeText: string;
  onResumeTextChange: (text: string) => void;
  jobDescriptionText: string;
  onJobDescriptionChange: (text: string) => void;
  companyName: string;
  onCompanyNameChange: (name: string) => void;
  roleTitle: string;
  onRoleTitleChange: (title: string) => void;
  piiResult: PiiSanitizationResult | null;
  onPiiResultChange: (result: PiiSanitizationResult | null) => void;
}

export const DualIngestion: React.FC<DualIngestionProps> = ({
  resumeText,
  onResumeTextChange,
  jobDescriptionText,
  onJobDescriptionChange,
  companyName,
  onCompanyNameChange,
  roleTitle,
  onRoleTitleChange,
  piiResult,
  onPiiResultChange,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isExtractingJd, setIsExtractingJd] = useState(false);
  const [jdUrl, setJdUrl] = useState("");
  const [jdUrlMessage, setJdUrlMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handler
  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);

    try {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size exceeds 10MB limit.");
      }

      const formData = new FormData();
      formData.append("file", file);

      const parseRes = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      const parseData = await parseRes.json();
      if (!parseRes.ok || !parseData.success) {
        throw new Error(parseData.error || "Failed to parse document");
      }

      const extractedText = parseData.data.text;
      setUploadedFileName(file.name);
      onResumeTextChange(extractedText);

      // Auto-trigger PII Sanitization
      const sanitizeRes = await fetch("/api/sanitize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extractedText }),
      });

      const sanitizeData = await sanitizeRes.json();
      if (sanitizeRes.ok && sanitizeData.success) {
        onPiiResultChange(sanitizeData.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Job URL Extractor
  const handleExtractJdUrl = async () => {
    if (!jdUrl.trim()) return;
    setIsExtractingJd(true);
    setJdUrlMessage(null);

    try {
      const res = await fetch("/api/extract-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jdUrl }),
      });
      const data = await res.json();

      if (data.success && data.text) {
        onJobDescriptionChange(data.text);
        if (data.detectedCompany && !companyName) {
          onCompanyNameChange(data.detectedCompany);
        }
        setJdUrlMessage("Job description extracted successfully!");
      } else {
        setJdUrlMessage(
          data.message || "Could not fetch automatically. Please paste below."
        );
      }
    } catch {
      setJdUrlMessage("Network error fetching URL. Please paste text below.");
    } finally {
      setIsExtractingJd(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT COLUMN: Resume Ingestion */}
      <div className="rounded-2xl bg-[#ffffff] border border-[#e3e6e1] p-6 shadow-xs flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#f0f2ee] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[#e8f4f1] text-[#12715b]">
                <FileText className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm text-[#17211d]">
                1. Candidate Resume Ingestion
              </h3>
            </div>
            <span className="text-xs text-[#52605b]">PDF, DOCX, MD, TXT (Max 10MB)</span>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-all ${
              dragActive
                ? "border-[#12715b] bg-[#e8f4f1]/50"
                : "border-[#e3e6e1] bg-[#f7f8f6]/70 hover:border-[#12715b]/60 hover:bg-[#e8f4f1]/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.md,.markdown,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
            />

            {isUploading ? (
              <div className="flex flex-col items-center gap-2 py-3">
                <Loader2 className="h-6 w-6 animate-spin text-[#12715b]" />
                <p className="text-xs font-medium text-[#17211d]">
                  Extracting text and scrubbing PII...
                </p>
              </div>
            ) : uploadedFileName ? (
              <div className="flex items-center justify-center gap-2 py-2">
                <CheckCircle2 className="h-5 w-5 text-[#12715b]" />
                <span className="text-xs font-medium text-[#17211d] truncate max-w-xs">
                  Loaded: {uploadedFileName}
                </span>
                <span className="text-xs text-[#12715b] underline ml-2">Replace</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 py-2">
                <UploadCloud className="h-7 w-7 text-[#52605b]" />
                <p className="text-xs font-medium text-[#17211d]">
                  Drag & drop your resume file or <span className="text-[#12715b] font-semibold">browse</span>
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#52605b] mt-1">
                  <span className="flex items-center gap-1">
                    <File className="h-3 w-3" /> PDF
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" /> DOCX
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FileCode className="h-3 w-3" /> Markdown
                  </span>
                </div>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Raw Text View / Paste Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#52605b]">
              <span>Resume Text Preview & Manual Paste:</span>
              <span>{resumeText.length} characters</span>
            </div>
            <textarea
              value={resumeText}
              onChange={(e) => {
                onResumeTextChange(e.target.value);
                // Trigger auto PII scan
                if (e.target.value.length > 50) {
                  fetch("/api/sanitize", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: e.target.value }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.success) onPiiResultChange(data.data);
                    })
                    .catch(() => {});
                }
              }}
              placeholder="Paste your software engineering resume here (or drop a PDF/DOCX above)..."
              rows={9}
              className="w-full rounded-xl border border-[#e3e6e1] bg-[#ffffff] p-3 text-xs text-[#17211d] focus:border-[#12715b] focus:ring-1 focus:ring-[#12715b] focus:outline-hidden font-mono leading-relaxed resize-none"
            />
          </div>
        </div>

        {piiResult && (
          <div className="mt-3 pt-3 border-t border-[#f0f2ee] flex items-center justify-between text-xs text-[#52605b]">
            <span>PII Status:</span>
            <span className="font-medium text-[#12715b]">
              {piiResult.redactedCount} items redacted • {piiResult.preservedLinks.length} dev links preserved
            </span>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Job Description & Target Metadata */}
      <div className="rounded-2xl bg-[#ffffff] border border-[#e3e6e1] p-6 shadow-xs flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#f0f2ee] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[#e8f4f1] text-[#12715b]">
                <Briefcase className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm text-[#17211d]">
                2. Target Job Description & Company
              </h3>
            </div>
            <span className="text-xs text-[#52605b]">Text Paste or Web URL</span>
          </div>

          {/* Role & Company Metadata Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#52605b] mb-1">
                Target Role Title
              </label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => onRoleTitleChange(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full rounded-lg border border-[#e3e6e1] bg-[#ffffff] px-3 py-2 text-xs text-[#17211d] focus:border-[#12715b] focus:ring-1 focus:ring-[#12715b] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52605b] mb-1">
                Target Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => onCompanyNameChange(e.target.value)}
                placeholder="e.g. Stripe, OpenAI, Datadog"
                className="w-full rounded-lg border border-[#e3e6e1] bg-[#ffffff] px-3 py-2 text-xs text-[#17211d] focus:border-[#12715b] focus:ring-1 focus:ring-[#12715b] focus:outline-hidden"
              />
            </div>
          </div>

          {/* URL Ingestion with Tiered Fallback */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#52605b]">
              Extract from Job Link (Optional)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="h-4 w-4 absolute left-3 top-2.5 text-[#52605b]" />
                <input
                  type="url"
                  value={jdUrl}
                  onChange={(e) => setJdUrl(e.target.value)}
                  placeholder="https://jobs.lever.co/... or greenhouse.io/..."
                  className="w-full rounded-lg border border-[#e3e6e1] bg-[#ffffff] pl-9 pr-3 py-2 text-xs text-[#17211d] focus:border-[#12715b] focus:ring-1 focus:ring-[#12715b] focus:outline-hidden"
                />
              </div>
              <button
                type="button"
                onClick={handleExtractJdUrl}
                disabled={isExtractingJd || !jdUrl.trim()}
                className="px-3 py-2 rounded-lg text-xs font-medium bg-[#17211d] text-white hover:bg-[#12715b] disabled:opacity-50 transition-all shrink-0 flex items-center gap-1.5"
              >
                {isExtractingJd ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span>Extract</span>
                )}
              </button>
            </div>
            {jdUrlMessage && (
              <p className="text-[11px] text-[#52605b] mt-1">{jdUrlMessage}</p>
            )}
          </div>

          {/* Job Description Text Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#52605b]">
              <span>Job Description Requirements:</span>
              <span>{jobDescriptionText.length} characters</span>
            </div>
            <textarea
              value={jobDescriptionText}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              placeholder="Paste the full job description (responsibilities, required qualifications, tech stack)..."
              rows={8}
              className="w-full rounded-xl border border-[#e3e6e1] bg-[#ffffff] p-3 text-xs text-[#17211d] focus:border-[#12715b] focus:ring-1 focus:ring-[#12715b] focus:outline-hidden font-sans leading-relaxed resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
