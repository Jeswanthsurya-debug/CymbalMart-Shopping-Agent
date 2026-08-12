import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Plus, Clock } from 'lucide-react';
import { PartyTimelineTask } from '../types';

interface TimelineViewProps {
  timeline: PartyTimelineTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<PartyTimelineTask, 'id' | 'completed'>) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  timeline,
  onToggleTask,
  onAddTask
}) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTimeframe, setNewTimeframe] = useState<PartyTimelineTask['timeframe']>('Day Before');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    onAddTask({
      timeframe: newTimeframe,
      task: newTaskText
    });
    setNewTaskText('');
  };

  const timeframes: PartyTimelineTask['timeframe'][] = [
    '1 Week Before',
    '2 Days Before',
    'Day Before',
    'Party Morning',
    '1 Hour Before'
  ];

  const totalTasks = timeline.length;
  const completedTasks = timeline.filter(t => t.completed).length;

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" /> Event Countdown & Prep Timeline
          </h3>
          <p className="text-xs text-slate-400">
            Step-by-step preparation checklist from 1 week out down to party hour.
          </p>
        </div>

        <div className="bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs font-bold text-amber-300">
          Prep Progress: {completedTasks}/{totalTasks} Completed ({totalTasks > 0 ? Math.round((completedTasks/totalTasks)*100) : 0}%)
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-6">
        <select
          value={newTimeframe}
          onChange={e => setNewTimeframe(e.target.value as any)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
        >
          {timeframes.map(tf => (
            <option key={tf} value={tf}>{tf}</option>
          ))}
        </select>
        <input
          type="text"
          value={newTaskText}
          onChange={e => setNewTaskText(e.target.value)}
          placeholder="Add custom prep task (e.g. Chill champagne, assemble balloon garland)..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </form>

      {/* Timeline Sections */}
      <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {timeframes.map(tf => {
          const tasksForTF = timeline.filter(t => t.timeframe === tf);
          if (tasksForTF.length === 0) return null;

          return (
            <div key={tf} className="relative pl-9">
              {/* Timeline marker icon */}
              <div className="absolute left-2.5 top-1 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-amber-400 ring-4 ring-slate-900" />

              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {tf}
              </h4>

              <div className="space-y-2">
                {tasksForTF.map(t => (
                  <div
                    key={t.id}
                    onClick={() => onToggleTask(t.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${
                      t.completed
                        ? 'bg-slate-900/60 border-slate-800 text-slate-500 line-through'
                        : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                    }`}
                  >
                    <button className="mt-0.5 shrink-0">
                      {t.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    <span className="text-xs font-medium leading-relaxed">{t.task}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
