import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchScheduler, createSchedule, deleteSchedule } from "../services/api";

const daysOfWeek = [
  { key: "Mon", label: "MON", num: 10 },
  { key: "Tue", label: "TUE", num: 11 },
  { key: "Wed", label: "WED", num: 12, isToday: true },
  { key: "Thu", label: "THU", num: 13 },
  { key: "Fri", label: "FRI", num: 14 },
  { key: "Sat", label: "SAT", num: 15 },
  { key: "Sun", label: "SUN", num: 16 },
];

const timeSlots = [
  "06:00 AM",
  "09:00 AM",
  "12:00 PM",
  "03:00 PM",
  "06:00 PM",
  "09:00 PM",
];

const SchedulerPage = () => {
  const [view, setView] = useState("calendar");
  const [events, setEvents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [pressure, setPressure] = useState(4.2);
  const [autoNotify, setAutoNotify] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const loadSchedulerData = async () => {
      try {
        const data = await fetchScheduler();
        setEvents(data.events || []);
        setAssignments(data.assignments || []);
      } catch (err) {
        console.error("Failed to load scheduler data:", err);
        addToast("Failed to load scheduled releases from backend.", "error");
      }
    };
    loadSchedulerData();
  }, []);

  // Quick setup form state
  const [formWard, setFormWard] = useState("Ward 12 - North Sector");
  const [formStart, setFormStart] = useState("09:00");
  const [formEnd, setFormEnd] = useState("11:30");

  // Create Modal form state
  const [modalWard, setModalWard] = useState("Ward 12 - North Sector");
  const [modalDay, setModalDay] = useState("Wed");
  const [modalStart, setModalStart] = useState("09:00");
  const [modalEnd, setModalEnd] = useState("11:30");

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Real-time pressure fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setPressure((prev) => {
        const noise = (Math.random() - 0.5) * 0.1;
        return parseFloat((prev + noise).toFixed(1));
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const timeToPx = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    const totalHours = h + m / 60;
    // grid starts at 6:00 AM (6.0)
    const relativeHours = Math.max(0, totalHours - 6);
    return Math.round(relativeHours * 26.6);
  };

  const handleApplySchedule = async (e, ward = formWard, start = formStart, end = formEnd, day = "Wed") => {
    if (e) e.preventDefault();
    if (!ward || !start || !end) {
      addToast("Please fill out all schedule parameters.", "error");
      return;
    }

    try {
      const res = await createSchedule({ ward, start, end, day });
      setEvents((prev) => [...prev, res.event]);
      setAssignments((prev) => [res.assignment, ...prev]);
      addToast(`Schedule applied! Water distribution for ${ward} added to calendar.`, "success");
      setShowCreateModal(false);
    } catch (err) {
      console.error(err);
      addToast("Failed to apply schedule.", "error");
    }
  };

  const getWeekRange = () => {
    const monday = new Date(2026, 5, 10);
    monday.setDate(monday.getDate() + weekOffset * 7);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const options = { month: "short", day: "numeric" };
    return `${monday.toLocaleDateString("en-US", options)} - ${sunday.toLocaleDateString("en-US", options)}`;
  };

  const getDaysOfWeek = () => {
    const monday = new Date(2026, 5, 10);
    monday.setDate(monday.getDate() + weekOffset * 7);
    const keys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const labels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    return keys.map((key, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        key,
        label: labels[i],
        num: d.getDate(),
        isToday: key === "Wed" && weekOffset === 0,
      };
    });
  };

  const currentDaysOfWeek = getDaysOfWeek();

  return (
    <div className="max-w-[1440px] flex flex-col h-full bg-background relative z-10 text-on-surface">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-on-surface">Distribution Scheduler</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage municipal water release for the upcoming week</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-container-high rounded-full p-1 border border-outline-variant/10">
            <button 
              onClick={() => setView("calendar")}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                view === "calendar" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Calendar View
            </button>
            <button 
              onClick={() => setView("list")}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                view === "list" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              List View
            </button>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Create New Schedule
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Scheduler Grid */}
        <section className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-6 flex flex-col gap-6">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="font-heading text-2xl font-bold text-primary">{getWeekRange()}</h2>
                <span className="px-3 py-1 bg-secondary-container/20 text-secondary font-semibold text-xs rounded-full border border-secondary/20">Week {24 + weekOffset}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setWeekOffset(prev => prev - 1)}
                  className="p-2 glass-card-hover rounded-lg text-on-surface-variant hover:text-primary transition-all border border-outline-variant/10 cursor-pointer flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <button 
                  onClick={() => setWeekOffset(prev => prev + 1)}
                  className="p-2 glass-card-hover rounded-lg text-on-surface-variant hover:text-primary transition-all border border-outline-variant/10 cursor-pointer flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            </div>

            {view === "calendar" ? (
              /* Time Grid Wrapper */
              <div className="relative overflow-x-auto rounded-xl border border-outline-variant/10 bg-surface-container-lowest/20">
                <div className="min-w-[800px]">
                  {/* Grid Headers */}
                  <div className="grid grid-cols-[100px_repeat(7,1fr)] bg-surface-container-high/50 border-b border-outline-variant/10 select-none">
                    <div className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Time</div>
                    {currentDaysOfWeek.map((day) => (
                      <div 
                        key={day.key} 
                        className={`p-3 text-center border-l border-outline-variant/10 ${
                          day.isToday ? "bg-primary-container/10 text-primary" : "text-on-surface-variant"
                        }`}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-widest">{day.label}</p>
                        <p className="font-bold text-lg mt-0.5">{day.num}</p>
                      </div>
                    ))}
                  </div>

                  {/* Grid Rows */}
                  <div className="relative">
                    {/* Horizontal Grid Lines */}
                    <div className="absolute inset-0 grid grid-rows-6 pointer-events-none">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="border-b border-outline-variant/5 h-20" />
                      ))}
                    </div>

                    {/* Day Columns with Cards */}
                    <div className="grid grid-cols-[100px_repeat(7,1fr)] relative h-[480px]">
                      {/* Time Column */}
                      <div className="flex flex-col text-on-surface-variant text-[11px] border-r border-outline-variant/10 font-semibold select-none bg-surface-container-low/20">
                        {timeSlots.map((time) => (
                          <div key={time} className="h-20 flex items-start p-2 border-b border-outline-variant/5">
                            {time}
                          </div>
                        ))}
                      </div>

                      {/* Columns for each day */}
                      {currentDaysOfWeek.map((day) => {
                        const dayEvents = events.filter((e) => e.day === day.key);
                        return (
                          <div 
                            key={day.key} 
                            className={`relative h-[480px] border-r border-outline-variant/5 ${
                              day.isToday ? "bg-primary-container/5" : ""
                            }`}
                          >
                            {/* Today Marker */}
                            {day.isToday && (
                              <div className="absolute top-24 left-0 right-0 h-[1px] bg-secondary shadow-[0_0_8px_#5de6ff] z-10 pointer-events-none" />
                            )}

                             {/* Event Cards */}
                             {(() => {
                               // Sort dayEvents by top to compute overlap layout
                               const sortedEvents = [...dayEvents].sort((a, b) => a.top - b.top);
                               const columns = [];
                               sortedEvents.forEach((event) => {
                                 let placed = false;
                                 for (let i = 0; i < columns.length; i++) {
                                   const lastEventInCol = columns[i][columns[i].length - 1];
                                   const overlaps = event.top < (lastEventInCol.top + lastEventInCol.height) &&
                                                    (event.top + event.height) > lastEventInCol.top;
                                   if (!overlaps) {
                                     columns[i].push(event);
                                     placed = true;
                                     break;
                                   }
                                 }
                                 if (!placed) {
                                   columns.push([event]);
                                 }
                               });

                               const eventPositions = {};
                               columns.forEach((col, colIndex) => {
                                 col.forEach((event) => {
                                   eventPositions[event.id] = {
                                     left: `${(colIndex / columns.length) * 100}%`,
                                     width: `${(1 / columns.length) * 100}%`
                                   };
                                 });
                               });

                               return sortedEvents.map((evt) => {
                                 const pos = eventPositions[evt.id] || { left: "0%", width: "100%" };
                                 return (
                                   <motion.div
                                     key={evt.id}
                                     whileHover={{ scale: 1.02 }}
                                     className={`absolute border-l-4 rounded-r p-2 group cursor-pointer transition-all ${evt.colorClass}`}
                                     style={{ 
                                       left: `calc(${pos.left} + 2px)`, 
                                       width: `calc(${pos.width} - 4px)`, 
                                       top: `${evt.top}px`, 
                                       height: `${evt.height}px`,
                                       zIndex: evt.status === "active" ? 20 : 10
                                     }}
                                   >
                                     {evt.status === "active" && (
                                       <div className="flex items-center gap-1 mb-0.5">
                                         <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                                         <p className="font-bold text-[8px] uppercase tracking-wider">Active</p>
                                       </div>
                                     )}
                                     <p className="font-bold text-xs truncate">{evt.label}</p>
                                     <p className="text-[9px] text-on-surface-variant mt-0.5">{evt.time}</p>
                                   </motion.div>
                                 );
                               });
                             })()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* List View Table */
              <div className="overflow-x-auto rounded-xl border border-outline-variant/10 bg-surface-container-lowest/20">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-surface-container-high/50 border-b border-outline-variant/10 select-none text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      <th className="p-4">Day</th>
                      <th className="p-4">Ward Name</th>
                      <th className="p-4">Time Slot</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {events.map((evt) => (
                      <tr key={evt.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-primary">{evt.day}</td>
                        <td className="p-4 font-semibold text-on-surface">{evt.label}</td>
                        <td className="p-4 text-on-surface-variant font-mono text-xs">{evt.time}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            evt.status === "active" ? "bg-primary/20 text-primary" :
                            evt.status === "completed" ? "bg-tertiary/20 text-tertiary" :
                            evt.status === "maintenance" ? "bg-warning/20 text-warning" :
                            "bg-surface-container-highest/50 text-on-surface-variant"
                          }`}>
                            {evt.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={async () => {
                              try {
                                await deleteSchedule(evt.id);
                                setEvents((prev) => prev.filter((e) => e.id !== evt.id));
                                addToast(`Schedule for ${evt.label} cancelled.`, "warning");
                              } catch (err) {
                                console.error(err);
                                addToast("Failed to cancel schedule.", "error");
                              }
                            }}
                            className="px-3 py-1.5 bg-error-container/20 text-error hover:bg-error/20 rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-error/30"
                          >
                            Cancel Release
                          </button>
                        </td>
                      </tr>
                    ))}
                    {events.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-on-surface-variant">
                          No scheduled releases found for this week.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bottom Sub-grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Assignments */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Upcoming Assignments</h3>
                <button className="text-primary text-xs font-semibold hover:underline cursor-pointer">View All</button>
              </div>
              <div className="space-y-3">
                {assignments.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">{item.name}</p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">{item.time}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-on-surface p-1">more_vert</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Customization */}
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Public Communication</h3>
                <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/5">
                  <div>
                    <p className="text-xs font-bold text-on-surface">Auto-notify Citizens</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">Send SMS/App alerts 30m before release</p>
                  </div>
                  <div 
                    onClick={() => {
                      const nextVal = !autoNotify;
                      setAutoNotify(nextVal);
                      addToast(nextVal ? "Auto-notify Citizens Enabled" : "Auto-notify Citizens Disabled", "info");
                    }}
                    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                      autoNotify ? "bg-primary" : "bg-surface-container-highest"
                    }`}
                  >
                    <motion.div 
                      layout
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
                      animate={{ x: autoNotify ? 20 : 0 }}
                    />
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 py-3 bg-surface-container-highest rounded-lg text-on-surface text-xs font-bold hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 cursor-pointer border border-outline-variant/10">
                <span className="material-symbols-outlined text-lg">sms</span>
                Customize SMS Alerts
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Insights & Quick Controls */}
        <section className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          {/* Pressure Insight Widget */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/10 blur-3xl group-hover:bg-secondary/20 transition-all duration-700 pointer-events-none"></div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-secondary">speed</span>
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Pressure Insight</h3>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold font-mono-metrics text-secondary">{pressure}</span>
                <span className="text-on-surface-variant text-xs font-semibold uppercase">bar</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                Predicted surge at <span className="text-on-surface font-bold">14:20 PM</span> today during Ward 12 activation.
              </p>
            </div>
            
            {/* Sparkline Graph */}
            <div className="h-20 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                <path className="text-secondary opacity-80" d="M0 35 Q 10 35, 20 25 T 40 30 T 60 10 T 80 15 T 100 5" fill="none" stroke="currentColor" strokeWidth="2"></path>
                <path className="text-secondary opacity-15" d="M0 35 Q 10 35, 20 25 T 40 30 T 60 10 T 80 15 T 100 5 L 100 40 L 0 40 Z" fill="currentColor"></path>
              </svg>
              <div className="absolute top-2 left-[60%] w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_#22d3ee]"></div>
            </div>

            <div className="mt-4 p-3 bg-surface-container-high rounded-xl border border-secondary/10 text-xs">
              <p className="text-secondary font-bold uppercase tracking-wider mb-0.5">Recommendation</p>
              <p className="text-on-surface-variant leading-relaxed">Open relief valve #04 (Sector B) 5 minutes prior to main release.</p>
            </div>
          </div>

          {/* Create New Mini-Form */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Quick Setup</h3>
            <form onSubmit={handleApplySchedule} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant uppercase font-bold px-1">Assign Ward</label>
                <select 
                  value={formWard}
                  onChange={(e) => setFormWard(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg p-3 text-xs focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option>Ward 12 - North Sector</option>
                  <option>Ward 08 - Garden Colony</option>
                  <option>Ward 21 - Metro Industrial</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-on-surface-variant uppercase font-bold px-1">Start Time</label>
                  <input 
                    type="time" 
                    value={formStart}
                    onChange={(e) => setFormStart(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg p-3 text-xs focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-on-surface-variant uppercase font-bold px-1">End Time</label>
                  <input 
                    type="time" 
                    value={formEnd}
                    onChange={(e) => setFormEnd(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg p-3 text-xs focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="p-3.5 bg-surface-container-high/30 rounded-xl border border-dashed border-outline-variant/30 flex items-center justify-center gap-2 cursor-pointer hover:bg-surface-container-high/50 transition-all select-none">
                <span className="material-symbols-outlined text-primary text-xl">file_upload</span>
                <span className="text-xs text-on-surface-variant">Batch Import CSV</span>
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-primary text-on-primary font-bold text-xs rounded-lg hover:scale-[1.01] active:scale-[0.98] transition-all shadow-xl shadow-primary/10 cursor-pointer"
              >
                Apply Schedule
              </button>
            </form>
          </div>

          {/* System Health Status */}
          <div className="glass-card rounded-2xl p-4 bg-surface-container-lowest/50 border-none flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-tertiary"></div>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Network Health</span>
            </div>
            <span className="text-[11px] font-bold text-tertiary">OPTIMAL</span>
          </div>
        </section>
      </div>

      {/* Create New Schedule Modal Overlay */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card max-w-md w-full p-6 rounded-2xl border border-outline-variant/10 bg-surface/90 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading text-xl font-bold text-on-surface">Create New Schedule</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-on-surface-variant hover:text-on-surface cursor-pointer flex items-center justify-center"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={(e) => handleApplySchedule(e, modalWard, modalStart, modalEnd, modalDay)} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-on-surface-variant uppercase font-bold px-1">Assign Ward</label>
                  <select 
                    value={modalWard}
                    onChange={(e) => setModalWard(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg p-3 text-xs focus:outline-none focus:border-primary transition-all cursor-pointer text-on-surface"
                  >
                    <option>Ward 12 - North Sector</option>
                    <option>Ward 08 - Garden Colony</option>
                    <option>Ward 21 - Metro Industrial</option>
                    <option>Ward 01 - Lakshmi Nagar</option>
                    <option>Ward 03 - Shivaji Peth</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-on-surface-variant uppercase font-bold px-1">Day of Week</label>
                  <select 
                    value={modalDay}
                    onChange={(e) => setModalDay(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg p-3 text-xs focus:outline-none focus:border-primary transition-all cursor-pointer text-on-surface"
                  >
                    <option value="Mon">Monday</option>
                    <option value="Tue">Tuesday</option>
                    <option value="Wed">Wednesday</option>
                    <option value="Thu">Thursday</option>
                    <option value="Fri">Friday</option>
                    <option value="Sat">Saturday</option>
                    <option value="Sun">Sunday</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-on-surface-variant uppercase font-bold px-1">Start Time</label>
                    <input 
                      type="time" 
                      value={modalStart}
                      onChange={(e) => setModalStart(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg p-3 text-xs focus:outline-none focus:border-primary transition-all text-on-surface"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-on-surface-variant uppercase font-bold px-1">End Time</label>
                    <input 
                      type="time" 
                      value={modalEnd}
                      onChange={(e) => setModalEnd(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg p-3 text-xs focus:outline-none focus:border-primary transition-all text-on-surface"
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full mt-4 py-3 bg-primary text-on-primary font-bold text-xs rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/10 cursor-pointer"
                >
                  Create Event
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              className="pointer-events-auto min-w-[300px] glass-card px-4 py-3 rounded-xl border border-outline-variant/20 shadow-2xl flex items-center gap-3 bg-surface/80 backdrop-blur-xl"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                toast.type === "error" ? "bg-error-container/20 text-error" : 
                toast.type === "warning" ? "bg-warning/20 text-warning" : 
                "bg-tertiary-container/20 text-tertiary"
              }`}>
                <span className="material-symbols-outlined text-lg">
                  {toast.type === "error" ? "error" : toast.type === "warning" ? "warning" : "check_circle"}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-on-surface-variant font-semibold">{toast.message}</p>
              </div>
              <button 
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer flex items-center justify-center p-0.5"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SchedulerPage;
