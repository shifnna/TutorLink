import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Loader2, X } from "lucide-react";
import { jobPostService } from "../../services/jobPostService";
import { IJobPost, IJobPostForm } from "../../types/IJobPost";
import { DURATIONS, LANGUAGES, LEVELS, LIMITS, SUBJECTS, TIMES, VALID_FOR, WEEKDAYS, addDaysLocal, emptyForm, toPayload, todayLocal, validate } from "../../utils/jobPostForm";
import { fraunces, useMidnightFonts } from "../../utils/midNightTheme";

type Props = { open: boolean; onClose: () => void; onSaved?: (post: IJobPost) => void };

const inputCls = "w-full rounded-xl bg-[#0E1016] border px-4 py-2.5 text-sm text-[#F3F4F8] placeholder:text-[#929AB2] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 focus:border-[#7C9CFF] transition [color-scheme:dark]";
const edge = (bad?: string) => (bad ? "border-[#F87171]" : "border-[#343B53]");
// blue chips for languages, purple chips for days (same colors as the subject tags on Home)
const chip = (on: boolean, tone: "blue" | "purple") =>
  `px-3.5 py-1.5 rounded-full text-xs font-medium border transition disabled:opacity-40 disabled:cursor-not-allowed ${
    on ? (tone === "blue" ? "bg-[#242E48] border-[#465A89] text-[#DCE5FF]" : "bg-[#30263E] border-[#58416F] text-[#F0DCFF]") : "border-[#343B53] text-[#C0C7DE] hover:border-[#7C9CFF]/60"
  }`;
const ghostBtn = "rounded-full px-6 h-11 text-sm font-medium border border-[#46516F] text-[#E4E8F7] hover:bg-[#242B40] hover:border-[#7C9CFF] transition-all disabled:opacity-50";
const gradBtn = "flex items-center justify-center gap-2 rounded-full px-6 h-11 text-sm font-semibold bg-gradient-to-r from-[#7C9CFF] to-[#A18BFA] text-[#101321] hover:brightness-110 transition-all disabled:opacity-60 disabled:hover:brightness-100";

const Field: React.FC<{ label: string; id?: string; error?: string; hint?: string; children: React.ReactNode }> = ({ label, id, error, hint, children }) => (
  <div>
    {id ? <label htmlFor={id} className="block text-xs font-semibold text-[#C0C7DE] mb-1.5">{label}</label> : <span className="block text-xs font-semibold text-[#C0C7DE] mb-1.5">{label}</span>}
    {children}
    {error ? <p role="alert" className="mt-1.5 text-xs text-[#F87171]">{error}</p> : hint ? <p className="mt-1.5 text-xs text-[#929AB2]">{hint}</p> : null}
  </div>
);

const PostJobModal: React.FC<Props> = ({ open, onClose, onSaved }) => {
  useMidnightFonts();
  const initial = useMemo(emptyForm, []);
  const [form, setForm] = useState<IJobPostForm>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [posted, setPosted] = useState<IJobPost | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  const reset = () => { setForm(initial); setErrors({}); setFormError(""); setPosted(null); };
  useEffect(() => { if (open) reset(); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const requestClose = useCallback(() => {
    if (submitting) return;
    if (!posted && dirty && !window.confirm("Discard what you typed?")) return;
    onClose();
  }, [submitting, posted, dirty, onClose]);

  // Esc closes, and the page behind stops scrolling
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && requestClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, requestClose]);

  const set = <K extends keyof IJobPostForm>(key: K, value: IJobPostForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFormError("");
    setErrors((e) => { if (!e[key]) return e; const next = { ...e }; delete next[key]; return next; });
  };
  const toggle = (key: "languages" | "preferredDays", value: string) =>
    set(key, form[key].includes(value) ? form[key].filter((x) => x !== value) : [...form[key], value]);

  const focusFirstError = () => setTimeout(() => {
    const el = bodyRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    el?.focus();
  }, 50);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // stops double clicks
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) { setFormError("Please fix the highlighted fields."); focusFirstError(); return; }

    setSubmitting(true);
    setFormError("");
    const res = await jobPostService.create(toPayload(form));
    setSubmitting(false);

    if (res.success && res.data) { setPosted(res.data); onSaved?.(res.data); return; }
    if (res.errors) setErrors(res.errors); // form stays filled, nothing is lost
    else setFormError(res.message || "Couldn't post your requirement. Please try again.");
    focusFirstError();
  };

  const numberKeys = (e: React.KeyboardEvent<HTMLInputElement>) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault();
  const maxLangReached = form.languages.length >= LIMITS.maxLanguages;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && requestClose()}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-labelledby="post-job-heading"
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#171A24] border border-[#38415C] text-[#F3F4F8] shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden"
            initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-1 flex-shrink-0 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />

            <header className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-[#343B53]">
              <div>
                <h2 id="post-job-heading" style={fraunces} className="text-2xl font-bold text-[#F8F9FF]">{posted ? "Requirement posted" : "Post a requirement"}</h2>
                {!posted && <p className="text-sm text-[#C0C7DE] mt-1">Tell tutors what you need. They will see it on the Find a job page.</p>}
              </div>
              <button type="button" onClick={requestClose} aria-label="Close" className="p-1.5 rounded-full text-[#C0C7DE] hover:text-white hover:bg-white/5 transition"><X className="w-5 h-5" /></button>
            </header>

            {posted ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8EA9FF] to-[#C49BFA] flex items-center justify-center"><BadgeCheck className="w-7 h-7 text-[#101321]" /></div>
                <p className="text-[#F8F9FF] font-semibold break-words">{posted.title}</p>
                <p className="text-sm text-[#C0C7DE] mt-2 max-w-md mx-auto">Tutors can message you now. Your post stays open for {posted.validForDays} days.</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={reset} className={ghostBtn}>Post another</button>
                  <button type="button" onClick={onClose} className={gradBtn}>Done</button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="flex flex-col flex-1 min-h-0">
                <div ref={bodyRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                  {formError && <div role="alert" className="rounded-xl border border-[#F87171]/40 bg-[#F87171]/10 px-4 py-3 text-sm text-[#FCA5A5]">{formError}</div>}

                  <Field label="Title" id="job-title" error={errors.title} hint="Example: Need a Class 10 maths tutor for exam preparation">
                    <input id="job-title" autoFocus value={form.title} maxLength={LIMITS.titleMax} onChange={(e) => set("title", e.target.value)} aria-invalid={!!errors.title} className={`${inputCls} ${edge(errors.title)}`} placeholder="What do you need help with?" />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Subject" id="job-subject" error={errors.subject}>
                      <input id="job-subject" list="job-subjects" value={form.subject} maxLength={LIMITS.subjectMax} onChange={(e) => set("subject", e.target.value)} aria-invalid={!!errors.subject} className={`${inputCls} ${edge(errors.subject)}`} placeholder="Pick or type a subject" />
                      <datalist id="job-subjects">{SUBJECTS.map((s) => <option key={s} value={s} />)}</datalist>
                    </Field>
                    <Field label="Level" id="job-level" error={errors.level}>
                      <select id="job-level" value={form.level} onChange={(e) => set("level", e.target.value)} aria-invalid={!!errors.level} className={`${inputCls} ${edge(errors.level)}`}>
                        <option value="">Choose level</option>
                        {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                      </select>
                    </Field>
                  </div>

                  <Field label={`Languages (up to ${LIMITS.maxLanguages})`} error={errors.languages}>
                    <div role="group" aria-label="Languages" aria-invalid={!!errors.languages} tabIndex={-1} className="flex flex-wrap gap-2 outline-none">
                      {LANGUAGES.map((l) => {
                        const on = form.languages.includes(l);
                        return <button key={l} type="button" aria-pressed={on} disabled={!on && maxLangReached} onClick={() => toggle("languages", l)} className={chip(on, "blue")}>{l}</button>;
                      })}
                    </div>
                  </Field>

                  <Field label="Description" id="job-desc" error={errors.description}>
                    <textarea id="job-desc" rows={4} value={form.description} maxLength={LIMITS.descMax} onChange={(e) => set("description", e.target.value)} aria-invalid={!!errors.description} className={`${inputCls} ${edge(errors.description)} resize-none`} placeholder="Current level, what you want to improve, any exam dates..." />
                    <p className="mt-1 text-right text-xs text-[#929AB2]">{form.description.length}/{LIMITS.descMax}</p>
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(["budgetMin", "budgetMax"] as const).map((k) => (
                      <Field key={k} label={k === "budgetMin" ? "Budget from (₹ per hour)" : "Budget up to (₹ per hour)"} id={`job-${k}`} error={errors[k]}>
                        <input id={`job-${k}`} type="number" inputMode="numeric" min={LIMITS.budgetMin} max={LIMITS.budgetMax} step={1} value={form[k]} onKeyDown={numberKeys} onWheel={(e) => e.currentTarget.blur()} onChange={(e) => set(k, e.target.value)} aria-invalid={!!errors[k]} className={`${inputCls} ${edge(errors[k])}`} placeholder={k === "budgetMin" ? "300" : "600"} />
                      </Field>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Session length" id="job-duration">
                      <select id="job-duration" value={form.sessionDuration} onChange={(e) => set("sessionDuration", Number(e.target.value))} className={`${inputCls} ${edge()}`}>
                        {DURATIONS.map((d) => <option key={d} value={d}>{d} minutes</option>)}
                      </select>
                    </Field>
                    <Field label="Preferred time" id="job-time">
                      <select id="job-time" value={form.preferredTime} onChange={(e) => set("preferredTime", e.target.value)} className={`${inputCls} ${edge()}`}>
                        {TIMES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </Field>
                  </div>

                  <Field label="Days you are free" error={errors.preferredDays} hint="The number of days you pick is the number of sessions per week">
                    <div role="group" aria-label="Days" aria-invalid={!!errors.preferredDays} tabIndex={-1} className="flex flex-wrap gap-2 outline-none">
                      {WEEKDAYS.map((d) => <button key={d.value} type="button" aria-pressed={form.preferredDays.includes(d.value)} onClick={() => toggle("preferredDays", d.value)} className={chip(form.preferredDays.includes(d.value), "purple")}>{d.label}</button>)}
                    </div>
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Start date" id="job-start" error={errors.startDate}>
                      <input id="job-start" type="date" min={todayLocal()} max={addDaysLocal(LIMITS.maxStartAheadDays)} value={form.startDate} onChange={(e) => set("startDate", e.target.value)} aria-invalid={!!errors.startDate} className={`${inputCls} ${edge(errors.startDate)}`} />
                    </Field>
                    <Field label="Keep this post open for" id="job-valid">
                      <select id="job-valid" value={form.validForDays} onChange={(e) => set("validForDays", Number(e.target.value))} className={`${inputCls} ${edge()}`}>
                        {VALID_FOR.map((d) => <option key={d} value={d}>{d} days</option>)}
                      </select>
                    </Field>
                  </div>
                </div>

                <footer className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#343B53]">
                  <button type="button" onClick={requestClose} disabled={submitting} className={ghostBtn}>Cancel</button>
                  <button type="submit" disabled={submitting} className={gradBtn}>
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {submitting ? "Posting..." : "Post requirement"}
                  </button>
                </footer>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default PostJobModal;