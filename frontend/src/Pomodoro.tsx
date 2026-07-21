import { useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';

type Mode = 'work' | 'short-break' | 'long-break';

const DURATIONS: Record<Mode, number> = {
  work: 25 * 60,
  'short-break': 5 * 60,
  'long-break': 15 * 60,
};

const LABELS: Record<Mode, string> = {
  work: 'Focus',
  'short-break': 'Short break',
  'long-break': 'Long break',
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function Pomodoro() {
  const { user, logout } = useAuth();
  const [mode, setMode] = useState<Mode>('work');
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.work);
  const [running, setRunning] = useState(false);
  const [completedRounds, setCompletedRounds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (secondsLeft !== 0 || !running) return;
    setRunning(false);
    if (mode === 'work') {
      const nextRounds = completedRounds + 1;
      setCompletedRounds(nextRounds);
      const nextMode = nextRounds % 4 === 0 ? 'long-break' : 'short-break';
      setMode(nextMode);
      setSecondsLeft(DURATIONS[nextMode]);
    } else {
      setMode('work');
      setSecondsLeft(DURATIONS.work);
    }
  }, [secondsLeft, running, mode, completedRounds]);

  function switchMode(nextMode: Mode) {
    setRunning(false);
    setMode(nextMode);
    setSecondsLeft(DURATIONS[nextMode]);
  }

  function reset() {
    setRunning(false);
    setSecondsLeft(DURATIONS[mode]);
  }

  const progress = 1 - secondsLeft / DURATIONS[mode];

  return (
    <div className="pomodoro">
      <header className="pomodoro-header">
        <span>
          Hi, <strong>{user?.firstName}</strong>
        </span>
        <button type="button" className="link" onClick={logout}>
          Log out
        </button>
      </header>

      <div className="mode-tabs">
        {(Object.keys(LABELS) as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            className={mode === m ? 'active' : ''}
            onClick={() => switchMode(m)}
          >
            {LABELS[m]}
          </button>
        ))}
      </div>

      <div className="timer-ring" style={{ '--progress': progress } as React.CSSProperties}>
        <span className="timer-display">{formatTime(secondsLeft)}</span>
      </div>

      <div className="timer-controls">
        <button type="button" className="primary" onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button type="button" onClick={reset}>
          Reset
        </button>
      </div>

      <p className="rounds">Completed focus sessions: {completedRounds}</p>
    </div>
  );
}
