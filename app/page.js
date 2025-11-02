'use client';

import { useState, useEffect, useRef } from 'react';
import './styles.css';

export default function PomodoroApp() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [todayStats, setTodayStats] = useState({ date: '', cycles: 0 });
  const audioRef = useRef(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedStats = localStorage.getItem('pomodoroStats');

    if (savedStats) {
      const stats = JSON.parse(savedStats);
      if (stats.date === today) {
        setTodayStats(stats);
        setCyclesCompleted(stats.cycles);
      } else {
        const newStats = { date: today, cycles: 0 };
        setTodayStats(newStats);
        localStorage.setItem('pomodoroStats', JSON.stringify(newStats));
      }
    } else {
      const newStats = { date: today, cycles: 0 };
      setTodayStats(newStats);
      localStorage.setItem('pomodoroStats', JSON.stringify(newStats));
    }
  }, []);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            playSound();
            if (!isBreak) {
              const newCycles = cyclesCompleted + 1;
              setCyclesCompleted(newCycles);
              const today = new Date().toDateString();
              const newStats = { date: today, cycles: newCycles };
              setTodayStats(newStats);
              localStorage.setItem('pomodoroStats', JSON.stringify(newStats));

              setIsBreak(true);
              setMinutes(5);
            } else {
              setIsBreak(false);
              setMinutes(25);
            }
            setIsActive(false);
            setSeconds(0);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isBreak, cyclesCompleted]);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(25);
    setSeconds(0);
  };

  const startBreak = () => {
    setIsActive(false);
    setIsBreak(true);
    setMinutes(5);
    setSeconds(0);
  };

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container">
      <div className="pomodoro-card">
        <h1 className="title">🍅 Pomodoro Timer</h1>

        <div className="status-badge">
          {isBreak ? '☕ Break Time' : '💼 Focus Time'}
        </div>

        <div className="timer-display">
          {formatTime(minutes, seconds)}
        </div>

        <div className="button-group">
          <button
            className={`btn ${isActive ? 'btn-pause' : 'btn-start'}`}
            onClick={toggleTimer}
          >
            {isActive ? '⏸ Pause' : '▶ Start'}
          </button>

          <button
            className="btn btn-reset"
            onClick={resetTimer}
          >
            🔄 Reset
          </button>

          {!isBreak && !isActive && (
            <button
              className="btn btn-break"
              onClick={startBreak}
            >
              ☕ Break
            </button>
          )}
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-label">Today's Cycles</div>
            <div className="stat-value">{todayStats.cycles}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Current Session</div>
            <div className="stat-value">{cyclesCompleted}</div>
          </div>
        </div>

        <div className="info-text">
          <p>✨ 25 min work · 5 min break</p>
          <p>📊 Stats saved daily</p>
        </div>
      </div>

      <audio ref={audioRef} src="/notification.mp3" />
    </div>
  );
}
