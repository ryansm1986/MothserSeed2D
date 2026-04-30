import type { GameEvent } from "../game/state";

export function pushLog(eventLog: HTMLElement, message: string, detail: string) {
  const line = document.createElement("div");
  line.innerHTML = detail ? `<strong>${message}</strong> ${detail}` : `<strong>${message}</strong>`;
  eventLog.prepend(line);
  while (eventLog.children.length > 5) {
    eventLog.lastElementChild?.remove();
  }
}

export function pushGameEvents(eventLog: HTMLElement, events: readonly GameEvent[], playSound: (event: GameEvent) => void) {
  events.forEach((event) => {
    if (event.kind === "log") pushLog(eventLog, event.message, event.detail);
    if (event.kind === "sound") playSound(event);
  });
}
