import { IJobFilterOptions } from "../../types/IJobPost";
import { LEVELS } from "../../utils/jobPostForm";
import { mono } from "../../utils/midNightTheme";

export type JobFilters = { subjects: string[]; languages: string[]; levels: string[]; minPay: number };
export const EMPTY_FILTERS: JobFilters = { subjects: [], languages: [], levels: [], minPay: 0 };
export const PAY_MAX = 2000;

type Props = { value: JobFilters; options: IJobFilterOptions; onChange: (next: JobFilters) => void };
type Item = { value: string; label: string };

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
// keep a ticked option visible even if no open requirement uses it any more
const withSelected = (options: string[], selected: string[]): Item[] => [...new Set([...options, ...selected])].map((v) => ({ value: v, label: v }));

const Group: React.FC<{ title: string; first?: boolean; children: React.ReactNode }> = ({ title, first, children }) => (
  <div className={first ? "" : "border-t border-[#343B53] pt-5 mt-5"}>
    <h3 className="text-sm font-semibold text-[#F8F9FF] mb-3">{title}</h3>
    {children}
  </div>
);

const CheckList: React.FC<{ items: Item[]; selected: string[]; onToggle: (v: string) => void; empty: string }> = ({ items, selected, onToggle, empty }) =>
  items.length === 0 ? (
    <p className="text-xs text-[#929AB2]">{empty}</p>
  ) : (
    <ul className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
      {items.map((it) => (
        <li key={it.value}>
          <label className="flex items-center gap-3 text-sm text-[#D0D5E8] cursor-pointer hover:text-[#F8F9FF] transition">
            <input type="checkbox" checked={selected.includes(it.value)} onChange={() => onToggle(it.value)} className="w-4 h-4 rounded accent-[#7C9CFF] flex-shrink-0" />
            <span className="break-words min-w-0">{it.label}</span>
          </label>
        </li>
      ))}
    </ul>
  );

const JobFilterSidebar: React.FC<Props> = ({ value, options, onChange }) => {
  const set = <K extends keyof JobFilters>(k: K, v: JobFilters[K]) => onChange({ ...value, [k]: v });
  const active = value.subjects.length + value.languages.length + value.levels.length > 0 || value.minPay > 0;

  return (
    <aside className="bg-[#171A24] border border-[#343B53] rounded-2xl p-6" aria-label="Filters">
      <div className="flex items-center justify-between mb-5">
        <p style={mono} className="text-sm text-[#C0C7DE]">Filters</p>
        {active && <button type="button" onClick={() => onChange(EMPTY_FILTERS)} className="text-xs font-medium text-[#AFC2FF] hover:text-[#F8F9FF] transition">Clear all</button>}
      </div>

      <Group title="Subjects" first>
        <CheckList items={withSelected(options.subjects, value.subjects)} selected={value.subjects} onToggle={(v) => set("subjects", toggle(value.subjects, v))} empty="No subjects yet" />
      </Group>

      <Group title="Languages">
        <CheckList items={withSelected(options.languages, value.languages)} selected={value.languages} onToggle={(v) => set("languages", toggle(value.languages, v))} empty="No languages yet" />
      </Group>

      <Group title="Level">
        <CheckList items={LEVELS} selected={value.levels} onToggle={(v) => set("levels", toggle(value.levels, v))} empty="" />
      </Group>

      <Group title="Minimum pay per hour">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[#929AB2]">{value.minPay === 0 ? "Any pay" : "At least"}</span>
          <span style={mono} className="text-xs text-[#8EA9FF]">₹{value.minPay}</span>
        </div>
        <input
          type="range" min={0} max={PAY_MAX} step={50} value={value.minPay} aria-label="Minimum pay per hour"
          onChange={(e) => set("minPay", Number(e.target.value))} className="w-full accent-[#7C9CFF]"
        />
        <div style={mono} className="flex justify-between text-[10px] text-[#929AB2] mt-1"><span>₹0</span><span>₹{PAY_MAX}</span></div>
      </Group>
    </aside>
  );
};

export default JobFilterSidebar;