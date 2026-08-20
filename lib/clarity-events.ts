type ClarityWindow = Window & {
  clarity?: (command: "event", eventName: string) => void;
};

export function trackClarityEvent(eventName: string) {
  if (typeof window === "undefined") return;

  const clarity = (window as ClarityWindow).clarity;
  if (typeof clarity === "function") clarity("event", eventName);
}
