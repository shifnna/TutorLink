import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Mail, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

interface ForgotPasswordModalProps {
  open: boolean;
  email?: string;
  onClose: () => void;
  onSend: () => Promise<void>;
}

const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  open,
  email,
  onClose,
  onSend,
}) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) setSent(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  const handleSend = async () => {
    setSending(true);
    try {
      await onSend();
      setSent(true);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Couldn't send the reset link.");
    } finally {
      setSending(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 isolate flex items-center justify-center px-4"
      style={{ pointerEvents: open ? "auto" : "none" }}
      onClick={onClose}
      aria-hidden={!open}
    >
      {/* Blur layer: opacity snaps instantly, never mid-animation. */}
      <div
        className={`absolute inset-0 backdrop-blur-sm ${open ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
      />
      {/* Tint layer: plain color, no filter, safe to fade smoothly. */}
      <div
        className={`absolute inset-0 bg-[#0E1016]/70 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      <AnimatePresence>
        {open && (
          <motion.div
            className="relative overflow-hidden bg-[#171A24] border border-[#2A2E3D] p-6 rounded-2xl shadow-xl w-full max-w-sm"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />

            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-[#9CA1B5] hover:text-[#F3F4F8] transition"
            >
              <X className="w-5 h-5" />
            </button>

            {!sent ? (
              <>
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-[#0E1016]" />
                </div>
                <h3 style={{ ...fraunces, fontWeight: 550 }} className="text-lg pr-6">
                  Reset your password by email
                </h3>
                <p className="text-sm text-[#9CA1B5] mt-2 mb-6">
                  We'll send a reset link to{" "}
                  <span className="text-[#F3F4F8]">{email || "your account email"}</span>. Use
                  it to set a new password without needing your current one.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-[#2A2E3D] px-4 py-2 text-sm text-[#F3F4F8] transition hover:bg-[#1E2230] hover:border-[#7C9CFF]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={sending}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] px-5 py-2 text-sm font-medium text-[#0E1016] transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {sending ? "Sending..." : "Send reset link"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-11 h-11 rounded-lg bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center mb-4">
                  <Check className="w-5 h-5 text-emerald-300" />
                </div>
                <h3 style={{ ...fraunces, fontWeight: 550 }} className="text-lg pr-6">
                  Check your inbox
                </h3>
                <p className="text-sm text-[#9CA1B5] mt-2 mb-6">
                  A reset link is on its way to <span className="text-[#F3F4F8]">{email}</span>.
                  It'll expire soon, so use it shortly after it arrives.
                </p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-[#2A2E3D] px-4 py-2 text-sm text-[#F3F4F8] transition hover:bg-[#1E2230] hover:border-[#7C9CFF]"
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
};