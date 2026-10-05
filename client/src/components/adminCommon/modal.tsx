import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: string; 
  children: React.ReactNode;
}

export const Modal = ({ open, onClose, title, width = "max-w-md", children }: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${width} max-h-[90vh] overflow-y-auto rounded-3xl bg-[#171A24] border border-[#2A2E3D] shadow-2xl p-7`}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          {title ? <h2 className="text-xl font-bold text-[#F3F4F8]">{title}</h2> : <span />}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9CA1B5] hover:text-[#F3F4F8] hover:bg-[#1E2230] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

type ConfirmTone = "danger" | "success" | "primary";

const confirmStyles: Record<ConfirmTone, string> = {
  danger: "bg-red-600 hover:bg-red-500 text-white",
  success: "bg-emerald-600 hover:bg-emerald-500 text-white",
  primary: "bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold",
};

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  tone?: ConfirmTone;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog = ({
  open, title, message, confirmLabel = "Confirm", tone = "primary", busy, onConfirm, onClose,
}: ConfirmDialogProps) => (
  <Modal open={open} onClose={onClose} title={title}>
    <p className="text-sm text-[#9CA1B5] leading-relaxed">{message}</p>
    <div className="flex justify-end gap-3 mt-7">
      <button
        onClick={onClose}
        className="px-4 py-2.5 rounded-xl border border-[#2A2E3D] text-sm text-[#F3F4F8] hover:bg-[#1E2230] hover:border-[#7C9CFF] transition"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={busy}
        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-60 ${confirmStyles[tone]}`}
      >
        {busy ? "Please wait…" : confirmLabel}
      </button>
    </div>
  </Modal>
);