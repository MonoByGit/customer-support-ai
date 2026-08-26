"use client";

import React, { useState } from "react";
import { BusinessProfile } from "@/lib/schemas";
import Link from "next/link";
import {
  Search,
  MessageSquarePlus,
  MoreVertical,
  Filter,
  CheckCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface WhatsAppSidebarProps {
  currentProfile: BusinessProfile;
  allProfiles: BusinessProfile[];
}

export const WhatsAppSidebar: React.FC<WhatsAppSidebarProps> = ({
  currentProfile,
  allProfiles,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread">("all");

  const filteredProfiles = allProfiles.filter((p) =>
    p.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 md:w-88 h-full bg-[#FFFFFF] border-r border-[var(--wa-divider)] flex flex-col shrink-0 select-none">
      {/* Sidebar Top Header */}
      <div className="bg-[var(--wa-panel)] px-4 py-2.5 flex items-center justify-between border-b border-[var(--wa-divider)]">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-[#2196F3] text-white flex items-center justify-center font-bold text-sm shadow-inner">
            AI
          </div>
          <div>
            <div className="font-semibold text-xs text-[var(--wa-text)]">WhatsApp Web</div>
            <div className="text-[10px] text-gray-500 font-medium">Simulator</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#54656F]">
          <Link
            href="/admin"
            className="p-1.5 hover:bg-gray-200/70 rounded-full transition-colors"
            title="Nieuw bedrijf toevoegen"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </Link>
          <button className="p-1.5 hover:bg-gray-200/70 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-2.5 border-b border-[var(--wa-divider)] space-y-2">
        <div className="bg-[var(--wa-panel)] rounded-lg px-3 py-1.5 flex items-center gap-2">
          <Search className="w-4 h-4 text-[#54656F]" />
          <input
            type="text"
            placeholder="Zoek of start een nieuw gesprek"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs text-[var(--wa-text)] placeholder:text-[#8696A0] w-full outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
              filterType === "all"
                ? "bg-[#2196F3] text-white"
                : "bg-[var(--wa-panel)] text-[#54656F] hover:bg-gray-200"
            }`}
          >
            Alles ({allProfiles.length})
          </button>
          <button
            onClick={() => setFilterType("unread")}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
              filterType === "unread"
                ? "bg-[#2196F3] text-white"
                : "bg-[var(--wa-panel)] text-[#54656F] hover:bg-gray-200"
            }`}
          >
            Ongelezen
          </button>
        </div>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[var(--wa-panel)]">
        {filteredProfiles.map((p) => {
          const isActive = p.slug === currentProfile.slug;
          const snippet =
            p.customGreeting ||
            `Welkom bij ${p.businessName}. Hoe kan ik je vandaag helpen?`;

          return (
            <Link
              key={p.slug}
              href={`/live/${p.slug}`}
              className={`flex items-center gap-3 px-3.5 py-3 transition-colors cursor-pointer ${
                isActive ? "bg-[var(--wa-panel)]" : "wa-surface hover:opacity-90"
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center border border-gray-200">
                  {p.avatarUrl ? (
                    <img
                      src={p.avatarUrl}
                      alt={p.businessName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[#0D47A1] font-bold text-base">
                      {p.businessName.charAt(0)}
                    </span>
                  )}
                </div>
                {isActive && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#2196F3] border-2 border-white rounded-full" />
                )}
              </div>

              {/* Chat info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="font-medium text-[13.5px] text-[var(--wa-text)] truncate">
                      {p.businessName}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2196F3] fill-[#2196F3] stroke-white shrink-0" />
                  </div>
                  <span className="text-[11px] text-[#667781] shrink-0 font-normal">
                    12:30
                  </span>
                </div>

                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-[#667781] truncate pr-2 flex items-center gap-1">
                    {isActive ? (
                      <CheckCheck className="w-3.5 h-3.5 text-[#2196F3] shrink-0" />
                    ) : null}
                    <span className="truncate">{snippet}</span>
                  </p>

                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-blue-100 text-[#0D47A1] shrink-0 font-semibold">
                    {p.industry}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Sidebar Footer Link */}
      <div className="p-3 bg-[var(--wa-panel)] border-t border-[var(--wa-divider)] flex items-center justify-between text-xs text-gray-600">
        <span className="text-[11px]">Assistenten</span>
        <Link
          href="/admin"
          className="text-[#2196F3] hover:underline font-semibold flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          <span>Website Ingesten</span>
        </Link>
      </div>
    </div>
  );
};
