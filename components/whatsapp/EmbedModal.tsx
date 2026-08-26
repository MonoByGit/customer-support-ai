"use client";

import React, { useState } from "react";
import { BusinessProfile } from "@/lib/schemas";
import {
  X,
  Code2,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

interface EmbedModalProps {
  profile: BusinessProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({
  profile,
  isOpen,
  onClose,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.origin : "https://jouwdomein.nl";
  const demoUrl = `${currentUrl}/demo/${profile.slug}`;
  const cleanPhone = (profile.phone || "+31612345678").replace(/[^0-9]/g, "");
  const waMeLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hoi ${profile.businessName}, ik wil graag een afspraak maken via WhatsApp!`
  )}`;

  const iframeSnippet = `<!-- WhatsApp AI Floating Chat Widget -->
<iframe
  src="${demoUrl}"
  style="position: fixed; bottom: 20px; right: 20px; width: 380px; height: 600px; border: none; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.25); z-index: 9999;"
  allow="microphone"
  title="WhatsApp AI Boekingsassistent"
></iframe>`;

  const buttonSnippet = `<!-- WhatsApp Direct Chat Button -->
<a
  href="${waMeLink}"
  target="_blank"
  rel="noopener noreferrer"
  style="display: inline-flex; align-items: center; gap: 8px; background-color: #25D366; color: #ffffff; padding: 12px 20px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-family: sans-serif;"
>
  <span>💬 Chat via WhatsApp</span>
</a>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-scale-up text-[#111B21]">
        {/* Header */}
        <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Website Integratie & Embed Code
              </h3>
              <p className="text-xs text-emerald-100">
                Plaats de WhatsApp AI widget direct op een live website
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* 1. Direct WhatsApp wa.me link */}
          <div className="space-y-1.5 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/80">
            <div className="flex items-center justify-between font-semibold text-emerald-950">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                1. Directe WhatsApp Click-to-Chat Link (wa.me)
              </span>
              <button
                onClick={() => copyToClipboard(waMeLink, "wame")}
                className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
              >
                {copiedType === "wame" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === "wame" ? "Gekopieerd" : "Kopieer"}</span>
              </button>
            </div>
            <p className="text-emerald-800 text-[11px]">
              Ideaal voor Google Ads, Instagram bio of advertenties.
            </p>
            <div className="bg-white p-2 rounded-lg border border-emerald-200 font-mono text-[11px] break-all select-all text-gray-700">
              {waMeLink}
            </div>
          </div>

          {/* 2. Floating iFrame Embed */}
          <div className="space-y-1.5 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between font-semibold text-gray-900">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-gray-700" />
                2. Floating Widget iFrame Snippet
              </span>
              <button
                onClick={() => copyToClipboard(iframeSnippet, "iframe")}
                className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
              >
                {copiedType === "iframe" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === "iframe" ? "Gekopieerd" : "Kopieer"}</span>
              </button>
            </div>
            <p className="text-gray-500 text-[11px]">
              Plak deze HTML-code vlak voor de <code className="text-emerald-700 font-bold">&lt;/body&gt;</code> tag van de website.
            </p>
            <pre className="bg-[#111B21] text-emerald-300 p-2.5 rounded-lg font-mono text-[10.5px] overflow-x-auto whitespace-pre-wrap">
              {iframeSnippet}
            </pre>
          </div>

          {/* 3. Button HTML Snippet */}
          <div className="space-y-1.5 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between font-semibold text-gray-900">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-gray-700" />
                3. Groene WhatsApp Button Snippet
              </span>
              <button
                onClick={() => copyToClipboard(buttonSnippet, "button")}
                className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
              >
                {copiedType === "button" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === "button" ? "Gekopieerd" : "Kopieer"}</span>
              </button>
            </div>
            <pre className="bg-[#111B21] text-emerald-300 p-2.5 rounded-lg font-mono text-[10.5px] overflow-x-auto whitespace-pre-wrap">
              {buttonSnippet}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#075E54] hover:bg-[#054c44] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
