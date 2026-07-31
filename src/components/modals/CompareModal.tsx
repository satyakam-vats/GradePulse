'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ArrowRightLeft, Trophy, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  students?: any[];
  allStudents?: any[];
}

export default function CompareModal({ isOpen, onClose, students, allStudents }: CompareModalProps) {
  const studentList = students || allStudents || [];

  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');

  const [isDropdown1Open, setIsDropdown1Open] = useState(false);
  const [isDropdown2Open, setIsDropdown2Open] = useState(false);

  const [selectedUsn1, setSelectedUsn1] = useState<string | null>(null);
  const [selectedUsn2, setSelectedUsn2] = useState<string | null>(null);

  const [compareData, setCompareData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const drop1Ref = useRef<HTMLDivElement>(null);
  const drop2Ref = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drop1Ref.current && !drop1Ref.current.contains(e.target as Node)) {
        setIsDropdown1Open(false);
      }
      if (drop2Ref.current && !drop2Ref.current.contains(e.target as Node)) {
        setIsDropdown2Open(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute master rank map over full student list
  const masterRankMap = useMemo(() => {
    const sorted = [...studentList].sort((a, b) => Number(b.cgpa || b.overallCgpa || 0) - Number(a.cgpa || a.overallCgpa || 0));
    const map = new Map<string, { rank: number; percentile: number }>();
    const total = studentList.length || 200;

    sorted.forEach((s, idx) => {
      const usn = s.usn || s.USN;
      const rank = idx + 1;
      const percentile = Number(((rank / total) * 100).toFixed(2));
      map.set(usn, { rank, percentile });
    });
    return map;
  }, [studentList]);

  // Filtered dropdown results
  const filtered1 = useMemo(() => {
    if (!search1.trim()) return studentList.slice(0, 6);
    const q = search1.toLowerCase();
    return studentList.filter(s => {
      const name = (s.name || s.Name || '').toLowerCase();
      const usn = (s.usn || s.USN || '').toLowerCase();
      return name.includes(q) || usn.includes(q);
    }).slice(0, 8);
  }, [studentList, search1]);

  const filtered2 = useMemo(() => {
    if (!search2.trim()) return studentList.slice(0, 6);
    const q = search2.toLowerCase();
    return studentList.filter(s => {
      const name = (s.name || s.Name || '').toLowerCase();
      const usn = (s.usn || s.USN || '').toLowerCase();
      return name.includes(q) || usn.includes(q);
    }).slice(0, 8);
  }, [studentList, search2]);

  useEffect(() => {
    if (selectedUsn1 && selectedUsn2) {
      setLoading(true);
      fetch(`/api/compare/${selectedUsn1}/${selectedUsn2}`)
        .then(res => res.json())
        .then(data => {
          setCompareData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [selectedUsn1, selectedUsn2]);

  if (!isOpen) return null;

  const s1 = studentList.find(s => (s.usn || s.USN) === selectedUsn1);
  const s2 = studentList.find(s => (s.usn || s.USN) === selectedUsn2);

  const rank1Info = selectedUsn1 ? masterRankMap.get(selectedUsn1) || { rank: 1, percentile: 0.5 } : null;
  const rank2Info = selectedUsn2 ? masterRankMap.get(selectedUsn2) || { rank: 1, percentile: 0.5 } : null;

  const cgpa1 = s1 ? Number(s1.cgpa || s1.overallCgpa || 0) : 0;
  const cgpa2 = s2 ? Number(s2.cgpa || s2.overallCgpa || 0) : 0;
  const cgpaDiff = Math.abs(cgpa1 - cgpa2).toFixed(2);

  // Grouped Bar Chart Data for Semester SGPA Comparison
  const semesterChartData = compareData?.student1?.semesterResults?.map((semRes1: any) => {
    const semNum = semRes1.semester?.number || 1;
    const semRes2 = compareData?.student2?.semesterResults?.find((r: any) => r.semester?.number === semNum);
    return {
      semester: `Sem ${semNum}`,
      [s1?.name?.split(' ')[0] || 'Student 1']: semRes1.sgpa || 0,
      [s2?.name?.split(' ')[0] || 'Student 2']: semRes2?.sgpa || 0
    };
  }) || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl ui-card rounded-3xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Top Bar Header */}
          <div className="px-6 py-5 border-b border-slate-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl theme-accent-bg text-white flex items-center justify-center shadow-md">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black font-display tracking-tight flex items-center gap-2">
                  Head-to-Head Duel Analytics
                  <span className="text-xs uppercase font-mono px-2 py-0.5 rounded-full theme-accent-bg text-white font-bold">
                    Precision Compare
                  </span>
                </h2>
                <p className="text-xs opacity-70 font-medium">Select two students for instant side-by-side performance duel</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-500/20 hover:opacity-100 opacity-70 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Student Selector Toolbar */}
          <div className="p-6 border-b border-slate-500/20 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Student 1 Selection */}
            <div ref={drop1Ref} className="space-y-1.5 relative">
              <label className="text-xs font-black uppercase tracking-wider theme-accent-text font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Student 1
              </label>

              {s1 ? (
                <div className="flex items-center justify-between p-3 rounded-2xl border theme-accent-border ui-card">
                  <div>
                    <div className="font-extrabold text-sm">{s1.name || s1.Name}</div>
                    <div className="text-xs font-mono theme-accent-text font-bold">
                      {s1.usn || s1.USN} &bull; Sec {s1.section || 'A'} &bull; CGPA {cgpa1.toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedUsn1(null);
                      setSearch1('');
                      setIsDropdown1Open(true);
                    }}
                    className="p-1.5 rounded-xl hover:bg-rose-500/20 text-rose-500 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-60" />
                  <input
                    type="text"
                    value={search1}
                    onFocus={() => setIsDropdown1Open(true)}
                    onChange={(e) => {
                      setSearch1(e.target.value);
                      setIsDropdown1Open(true);
                    }}
                    placeholder="Type name or USN (e.g. Shrinkhala / 1SI24CS168)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-500/20 bg-slate-500/10 text-xs font-semibold focus:outline-none theme-accent-border shadow-sm"
                  />

                  {isDropdown1Open && filtered1.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 ui-card border border-slate-500/20 rounded-2xl shadow-2xl overflow-hidden max-h-56 overflow-y-auto backdrop-blur-xl">
                      {filtered1.map((st) => {
                        const usn = st.usn || st.USN;
                        const rankInfo = masterRankMap.get(usn) || { rank: 1 };
                        return (
                          <button
                            key={usn}
                            onClick={() => {
                              setSelectedUsn1(usn);
                              setSearch1(st.name || st.Name);
                              setIsDropdown1Open(false);
                            }}
                            className="w-full text-left p-3 hover:bg-slate-500/10 border-b border-slate-500/10 last:border-0 transition-colors flex items-center justify-between cursor-pointer"
                          >
                            <div>
                              <div className="font-bold text-xs">{st.name || st.Name}</div>
                              <div className="text-[11px] font-mono opacity-70">{usn} &bull; Sec {st.section || 'A'}</div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full theme-accent-bg text-white font-mono font-bold text-[10px]">
                              Rank {rankInfo.rank}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Student 2 Selection */}
            <div ref={drop2Ref} className="space-y-1.5 relative">
              <label className="text-xs font-black uppercase tracking-wider theme-secondary-text font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Student 2
              </label>

              {s2 ? (
                <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-500/30 ui-card">
                  <div>
                    <div className="font-extrabold text-sm">{s2.name || s2.Name}</div>
                    <div className="text-xs font-mono theme-secondary-text font-bold">
                      {s2.usn || s2.USN} &bull; Sec {s2.section || 'A'} &bull; CGPA {cgpa2.toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedUsn2(null);
                      setSearch2('');
                      setIsDropdown2Open(true);
                    }}
                    className="p-1.5 rounded-xl hover:bg-rose-500/20 text-rose-500 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-60" />
                  <input
                    type="text"
                    value={search2}
                    onFocus={() => setIsDropdown2Open(true)}
                    onChange={(e) => {
                      setSearch2(e.target.value);
                      setIsDropdown2Open(true);
                    }}
                    placeholder="Type name or USN (e.g. Shreya / 1SI24CS167)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-500/20 bg-slate-500/10 text-xs font-semibold focus:outline-none theme-accent-border shadow-sm"
                  />

                  {isDropdown2Open && filtered2.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 ui-card border border-slate-500/20 rounded-2xl shadow-2xl overflow-hidden max-h-56 overflow-y-auto backdrop-blur-xl">
                      {filtered2.map((st) => {
                        const usn = st.usn || st.USN;
                        const rankInfo = masterRankMap.get(usn) || { rank: 1 };
                        return (
                          <button
                            key={usn}
                            onClick={() => {
                              setSelectedUsn2(usn);
                              setSearch2(st.name || st.Name);
                              setIsDropdown2Open(false);
                            }}
                            className="w-full text-left p-3 hover:bg-slate-500/10 border-b border-slate-500/10 last:border-0 transition-colors flex items-center justify-between cursor-pointer"
                          >
                            <div>
                              <div className="font-bold text-xs">{st.name || st.Name}</div>
                              <div className="text-[11px] font-mono opacity-70">{usn} &bull; Sec {st.section || 'A'}</div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full theme-secondary-bg text-white font-mono font-bold text-[10px]">
                              Rank {rankInfo.rank}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Comparison Output Container */}
          <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
            {(!selectedUsn1 || !selectedUsn2) ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl theme-accent-bg text-white mx-auto flex items-center justify-center shadow-lg">
                  <ArrowRightLeft className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold">Select Both Students Above</h4>
                <p className="text-xs opacity-70 max-w-sm mx-auto">
                  Type student names or USNs in both fields above to initiate precision head-to-head comparison analytics.
                </p>
              </div>
            ) : loading ? (
              <div className="py-16 text-center opacity-70 space-y-3 animate-pulse">
                <div className="w-10 h-10 rounded-full theme-accent-bg mx-auto animate-ping" />
                <p className="text-xs font-mono font-bold">Computing Head-to-Head Metrics...</p>
              </div>
            ) : (
              <>
                {/* Victor Banner */}
                <div className="p-4 rounded-2xl border theme-accent-border ui-card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-md">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase font-bold text-amber-500">Head-to-Head Victor</div>
                      <div className="text-base font-black">
                        {cgpa1 > cgpa2 ? s1?.name : cgpa2 > cgpa1 ? s2?.name : 'Tied Performance'} 
                        {cgpa1 !== cgpa2 && (
                          <span className="theme-accent-text font-extrabold ml-2">
                            leads by +{cgpaDiff} CGPA
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 font-mono text-xs font-bold">
                    <span className="px-3 py-1 rounded-xl theme-accent-bg text-white">
                      Rank {rank1Info?.rank} vs Rank {rank2Info?.rank}
                    </span>
                  </div>
                </div>

                {/* Side-by-Side Student Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Student 1 Card */}
                  <div className="p-5 rounded-2xl border theme-accent-border ui-card space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-3">
                      <div>
                        <span className="text-xs font-mono font-bold theme-accent-text">{s1?.usn || s1?.USN}</span>
                        <h3 className="text-lg font-black">{s1?.name || s1?.Name}</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full theme-accent-bg text-white font-mono font-black text-xs">
                        Rank {rank1Info?.rank}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-2.5 rounded-xl border border-slate-500/20 bg-slate-500/10">
                        <div className="text-[10px] uppercase font-mono opacity-70">CGPA</div>
                        <div className="text-xl font-black theme-accent-text font-display">{cgpa1.toFixed(2)}</div>
                      </div>
                      <div className="p-2.5 rounded-xl border border-slate-500/20 bg-slate-500/10">
                        <div className="text-[10px] uppercase font-mono opacity-70">Percentile</div>
                        <div className="text-xl font-black theme-accent-text font-display">Top {rank1Info?.percentile}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Student 2 Card */}
                  <div className="p-5 rounded-2xl border border-slate-500/30 ui-card space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-3">
                      <div>
                        <span className="text-xs font-mono font-bold theme-secondary-text">{s2?.usn || s2?.USN}</span>
                        <h3 className="text-lg font-black">{s2?.name || s2?.Name}</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full theme-secondary-bg text-white font-mono font-black text-xs">
                        Rank {rank2Info?.rank}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-2.5 rounded-xl border border-slate-500/20 bg-slate-500/10">
                        <div className="text-[10px] uppercase font-mono opacity-70">CGPA</div>
                        <div className="text-xl font-black theme-secondary-text font-display">{cgpa2.toFixed(2)}</div>
                      </div>
                      <div className="p-2.5 rounded-xl border border-slate-500/20 bg-slate-500/10">
                        <div className="text-[10px] uppercase font-mono opacity-70">Percentile</div>
                        <div className="text-xl font-black theme-secondary-text font-display">Top {rank2Info?.percentile}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grouped Bar Chart: Semester SGPA Progression */}
                {semesterChartData.length > 0 && (
                  <div className="p-5 rounded-2xl border border-slate-500/20 ui-card space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider font-mono opacity-70">
                      Semester-by-Semester SGPA Progression
                    </h4>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={semesterChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                          <XAxis dataKey="semester" tick={{ fontSize: 11, fill: 'currentColor', fontWeight: 600 }} />
                          <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: 'currentColor' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                          />
                          <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                          <Bar dataKey={s1?.name?.split(' ')[0] || 'Student 1'} fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey={s2?.name?.split(' ')[0] || 'Student 2'} fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
