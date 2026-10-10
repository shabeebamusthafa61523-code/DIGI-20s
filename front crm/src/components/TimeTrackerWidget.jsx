import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock, DollarSign, CheckCircle2, ChevronDown, RefreshCw } from 'lucide-react';
import { useToast } from './ToastProvider';

const TimeTrackerWidget = ({ onTimeLogged }) => {
  const { showToast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedTask, setSelectedTask] = useState('Design Homepage Mockup (Client: DIGI 360)');
  const [billable, setBillable] = useState(true);
  const [hourlyRate, setHourlyRate] = useState(1500); // ₹1,500/hr default
  const [recentLogs, setRecentLogs] = useState([
    { id: 1, task: 'Social Media Video Edit', duration: '01:45:00', hours: 1.75, billableAmount: 2625, date: 'Today' },
    { id: 2, task: 'SEO Keyword Audit', duration: '00:50:00', hours: 0.83, billableAmount: 1245, date: 'Yesterday' },
  ]);

  useEffect(() => {
    let interval = null;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    showToast('Time tracking started!', 'info');
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    showToast(isPaused ? 'Timer resumed' : 'Timer paused', 'info');
  };

  const handleStop = () => {
    if (seconds < 5) {
      showToast('Timer stopped (duration too short to log).', 'warning');
      setIsRunning(false);
      setIsPaused(false);
      setSeconds(0);
      return;
    }

    const durationStr = formatTimer(seconds);
    const hoursSpent = +(seconds / 3600).toFixed(2);
    const billableVal = billable ? Math.round(hoursSpent * hourlyRate) : 0;

    const newLog = {
      id: Date.now(),
      task: selectedTask,
      duration: durationStr,
      hours: hoursSpent,
      billableAmount: billableVal,
      date: 'Just now'
    };

    setRecentLogs([newLog, ...recentLogs]);
    setIsRunning(false);
    setIsPaused(false);
    setSeconds(0);

    showToast(`Time logged successfully! ${durationStr} (${hoursSpent} hrs - ₹${billableVal.toLocaleString()})`, 'success');

    if (onTimeLogged) onTimeLogged(newLog);
  };

  const calculatedBillable = billable ? Math.round((seconds / 3600) * hourlyRate) : 0;

  return (
    <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xl flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">
              Task Time Tracker & Client Billable Hours
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">Live stopwatch timer & automatic time logger</span>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
          isRunning && !isPaused ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 animate-pulse' :
          isPaused ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' :
          'bg-slate-100 text-slate-500 dark:bg-slate-800'
        }`}>
          {isRunning && !isPaused ? 'Timer Active' : isPaused ? 'Paused' : 'Ready'}
        </span>
      </div>

      {/* Timer Display & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50/80 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
        {/* Timer Digital Display */}
        <div className="flex flex-col items-center justify-center">
          <span className="font-mono text-4xl font-black tracking-widest text-slate-900 dark:text-white drop-shadow-sm">
            {formatTimer(seconds)}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Current Session Duration
          </span>
        </div>

        {/* Task Selector & Rate */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Select Active Task & Client</label>
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            disabled={isRunning}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="Design Homepage Mockup (Client: DIGI 360)">Design Homepage Mockup (Client: DIGI 360)</option>
            <option value="Social Media Video Reel Editing (Client: Nike)">Social Media Video Reel Editing (Client: Nike)</option>
            <option value="SEO Technical Audit (Client: Apple Tech)">SEO Technical Audit (Client: Apple Tech)</option>
            <option value="Client Strategic Meeting (Client: Meta)">Client Strategic Meeting (Client: Meta)</option>
          </select>

          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={billable}
                onChange={(e) => setBillable(e.target.checked)}
                className="accent-cyan-500 w-4 h-4 rounded"
              />
              <span>Billable to Client (₹{hourlyRate}/hr)</span>
            </label>

            {billable && (
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                +₹{calculatedBillable.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:brightness-110 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" /> Start Timer
            </button>
          ) : (
            <>
              <button
                onClick={handlePause}
                className="p-3.5 rounded-2xl bg-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-md hover:bg-amber-600 transition-all cursor-pointer"
                title={isPaused ? "Resume" : "Pause"}
              >
                {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
              </button>
              <button
                onClick={handleStop}
                className="px-5 py-3.5 rounded-2xl bg-rose-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-600/25 hover:bg-rose-700 transition-all cursor-pointer"
              >
                <Square className="w-4 h-4 fill-white" /> Stop & Log Time
              </button>
            </>
          )}
        </div>
      </div>

      {/* Recent Logged Time Table */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Recent Time Logs</h4>
        <div className="space-y-2">
          {recentLogs.map(log => (
            <div key={log.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-black text-slate-800 dark:text-slate-200">{log.task}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-500 font-semibold">
                <span>{log.duration} ({log.hours} hrs)</span>
                {log.billableAmount > 0 && (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{log.billableAmount.toLocaleString()}</span>
                )}
                <span className="text-[10px] text-slate-400">{log.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeTrackerWidget;
