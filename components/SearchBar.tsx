"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

type SpeechRecognitionConstructor = new () => {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult:
    | null
    | ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void);
  onerror: null | (() => void);
  onend: null | (() => void);
};

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface SearchBarProps {
  compact?: boolean;
  defaultValue?: string;
  placeholder?: string;
  basePath?: string;
  label?: string;
}

export default function SearchBar({
  compact = false,
  defaultValue = "",
  placeholder = "Search individual adaptive clothing items...",
  basePath = "/search",
  label = "Search adaptive clothing",
}: SearchBarProps) {
  const inputId = useId();
  const [query, setQuery] = useState(defaultValue);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("");
  const recognitionRef = useRef<InstanceType<SpeechRecognitionConstructor> | null>(null);
  const router = useRouter();

  useEffect(() => {
    setSpeechSupported(
      typeof window !== "undefined" &&
        Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
    );
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`${basePath}?${params.toString()}`);
  }

  function startVoiceSearch() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (!transcript) return;
      setQuery(transcript);
      setStatus(`Voice search heard: ${transcript}`);
    };
    recognition.onerror = () => {
      setStatus("Voice search was not available. You can still type your search.");
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setStatus("Listening. Try saying wheelchair jeans, magnetic shirt, or easy shoes.");
    setListening(true);
    recognition.start();
  }

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className={compact ? "sr-only" : "mb-2 block text-sm font-bold text-ink"}
      >
        {label}
      </label>
      <form
        onSubmit={handleSubmit}
        className={`flex w-full gap-2 ${compact ? "h-11" : "h-14"}`}
        role="search"
        aria-label="Search adaptive clothing items"
      >
        <div className="relative flex-1">
          <svg
            className={`absolute top-1/2 -translate-y-1/2 text-ink/45 ${
              compact ? "left-3 h-4 w-4" : "left-4 h-5 w-5"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={compact ? "Search clothing..." : placeholder}
            className={`h-full w-full border border-ink/20 bg-paper text-ink shadow-inner placeholder:text-ink/45 focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-600 ${
              compact
                ? "rounded-lg pl-9 pr-10 text-sm"
                : "rounded-xl pl-12 pr-12 text-base"
            }`}
          />
          {speechSupported && (
            <button
              type="button"
              onClick={startVoiceSearch}
              className={`absolute top-1/2 -translate-y-1/2 rounded-lg text-ink/65 hover:bg-sand/60 hover:text-ink ${
                compact ? "right-1 p-2" : "right-2 p-2.5"
              }`}
              aria-label={listening ? "Listening for voice search" : "Start voice search"}
              aria-pressed={listening}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" />
                <path d="M19 11a7 7 0 0 1-14 0" />
                <path d="M12 18v3" />
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          className={`flex-shrink-0 border border-primary-900 bg-primary-700 font-bold text-white shadow-[0_2px_0_#30202C] transition hover:-translate-y-0.5 hover:bg-primary-800 ${
            compact
              ? "rounded-lg px-4 text-sm"
              : "rounded-xl px-7 text-base"
          }`}
        >
          {compact ? "Go" : "Search"}
        </button>
      </form>
      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
