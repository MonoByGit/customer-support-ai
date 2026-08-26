"use client";

import React from "react";
import { BusinessProfile } from "@/lib/schemas";
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  HelpCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface BusinessInfoModalProps {
  profile: BusinessProfile;
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceTitle: string) => void;
}

export const BusinessInfoModal: React.FC<BusinessInfoModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSelectService,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-gray-100 animate-scale-up">
        {/* Header */}
        <div className="bg-[#075E54] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/30">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.businessName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white leading-tight">
                {profile.businessName}
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Bedrijfsprofiel & WhatsApp AI Configuratie
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

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-[#111B21] text-xs sm:text-sm">
          {/* Tagline */}
          {profile.tagline && (
            <div className="italic text-gray-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-xs">
              "{profile.tagline}"
            </div>
          )}

          {/* Quick Contact & Details */}
          <div className="space-y-2 bg-gray-50 p-3.5 rounded-xl border border-gray-200/70 text-xs text-gray-700">
            {profile.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.email && (
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.address && (
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profile.address}</span>
              </div>
            )}
            {profile.openingHours && (
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profile.openingHours}</span>
              </div>
            )}
            {profile.websiteUrl && (
              <div className="flex items-center gap-2.5 pt-1">
                <ExternalLink className="w-4 h-4 text-emerald-600 shrink-0" />
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:underline font-medium truncate"
                >
                  {profile.websiteUrl}
                </a>
              </div>
            )}
          </div>

          {/* Services List */}
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Beschikbare Behandelingen & Diensten
            </h4>
            <div className="space-y-2">
              {profile.services.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl border border-gray-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/40 transition-all flex items-center justify-between gap-3 group"
                >
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-emerald-900">
                      {s.title}
                    </div>
                    {s.description && (
                      <div className="text-gray-500 text-xs mt-0.5">{s.description}</div>
                    )}
                    <div className="text-[11px] text-emerald-700 font-medium mt-1">
                      Duur: {s.durationMinutes} min {s.price ? `• ${s.price}` : ""}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onSelectService(s.title);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 shadow-xs"
                  >
                    Boek via Chat
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs List */}
          {profile.faqs.length > 0 && (
            <div>
              <h4 className="font-bold text-sm text-gray-900 mb-2.5 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                Veelgestelde Vragen (FAQs)
              </h4>
              <div className="space-y-2">
                {profile.faqs.map((f, i) => (
                  <div
                    key={i}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-xs space-y-1"
                  >
                    <div className="font-semibold text-gray-900">Q: {f.question}</div>
                    <div className="text-gray-600">A: {f.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-[#075E54] hover:bg-[#054c44] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            Terug naar WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};
