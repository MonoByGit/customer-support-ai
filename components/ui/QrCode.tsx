"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QrCodeProps {
  value: string;
  size?: number;
  /** Donkere modules. Standaard Deep Sapphire zodat de code in het merk blijft. */
  color?: string;
  className?: string;
  label?: string;
}

/**
 * Rendert een QR-code als data-URI. Geen externe QR-service, dus geen
 * klantdata die naar een derde partij lekt en geen afhankelijkheid die kan uitvallen.
 */
export const QrCode: React.FC<QrCodeProps> = ({
  value,
  size = 180,
  color = "#0D47A1",
  className = "",
  label,
}) => {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: color, light: "#FFFFFF" },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [value, size, color]);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-white/15 text-[10px] text-slate-400 text-center p-2 ${className}`}
        style={{ width: size, height: size }}
      >
        QR-code niet beschikbaar
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <div
        className="rounded-xl bg-white p-2 border border-slate-200 shadow-2xs"
        style={{ width: size + 16, height: size + 16 }}
      >
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt={label || `QR-code naar ${value}`}
            width={size}
            height={size}
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full animate-pulse rounded-lg bg-slate-100" />
        )}
      </div>
      {label && (
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-center max-w-[200px] leading-snug">
          {label}
        </span>
      )}
    </div>
  );
};
