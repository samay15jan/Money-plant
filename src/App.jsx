import { useEffect, useRef, useState } from "react";
import Plant3D from "./Plant3D.jsx";
import "./app.css";

const START_DATE = new Date("2026-02-10T00:00:00");

function getAge() {
  const now = new Date();

  let years = now.getFullYear() - START_DATE.getFullYear();
  let months = now.getMonth() - START_DATE.getMonth();
  let days = now.getDate() - START_DATE.getDate();

  if (days < 0) {
    months--;
    const previousMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0
    ).getDate();

    days += previousMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diff =
    now -
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      START_DATE.getHours(),
      START_DATE.getMinutes(),
      START_DATE.getSeconds()
    );

  const totalSeconds = Math.floor(diff / 1000);

  return {
    years,
    months,
    days,
    hours: Math.floor(totalSeconds / 3600) % 24,
    minutes: Math.floor(totalSeconds / 60) % 60,
    seconds: totalSeconds % 60,
  };
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function pad(n) {
  return String(n).padStart(2, "0");
}

const WAVE_BARS = Array.from(
  { length: 28 },
  (_, i) => 0.35 + ((i * 37) % 65) / 100
);

function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`music-player ${isPlaying ? "is-playing" : ""}`}>
      <audio
        ref={audioRef}
        src="/john_wayne_cas.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <button
        className="music-toggle"
        onClick={toggle}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <svg width="12" height="12" viewBox="0 0 24 24">
            <rect
              x="5"
              y="4"
              width="5"
              height="16"
              rx="1.2"
              fill="currentColor"
            />
            <rect
              x="14"
              y="4"
              width="5"
              height="16"
              rx="1.2"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24">
            <path
              d="M7 4.5V19.5L19 12L7 4.5Z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>

      <div className="wave">
        {WAVE_BARS.map((seed, i) => (
          <span
            key={i}
            className="wave-bar"
            style={{
              "--seed": seed,
              animationDelay: `${(i * 0.07).toFixed(2)}s`,
            }}
          />
        ))}
      </div>

      <span className="music-label">John Wayne - CAS</span>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M3.5 9.5H20.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M8 3V6.5M16 3V6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function App() {
  const [age, setAge] = useState(getAge);

  useEffect(() => {
    const timer = setInterval(() => setAge(getAge()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-shell">
      {/* Text */}
      <section className="content-section">
        <main className="story-main">
          <div className="hero-left">
            <h1 className="quote">
              Flowers fades
              <br />
              but this one
              <br />
              <span className="accent">
                <s>stays</s>
              </span>
              <s>{" "}</s>
              <s>over</s>
              <br />
              <span className="accent">grows</span> with time.
            </h1>

            <p className="quote-sub">
              samay ke sath bhi
              <br />
              samay ke baad bhi...
            </p>

            <div className="date-row">
              <div className="date-block">
                <div className="date-label">Birth</div>

                <div className="date-value">
                  {formatDate(START_DATE)}
                </div>
              </div>

              <div className="date-divider" />

              <div className="date-block">
                <div className="date-label">Growing For</div>
                <div className="age-clock">
                  {age.years}y {age.months}m {age.days}d
                </div>
              </div>
            </div>

            <MusicPlayer />
          </div>
        </main>
      </section>

      {/* Plant */}
      <section className="plant-section">
        <div className="plant-canvas-wrap">
          <Plant3D />
        </div>
      </section>
    </div>
  );
}