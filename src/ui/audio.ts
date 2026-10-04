export class AudioCues {
  private context: AudioContext | null = null;
  private muted = true;

  setMuted(muted: boolean): void {
    this.muted = muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  play(kind: "step" | "confirm" | "battle" | "hit" | "capture" | "badge"): void {
    if (this.muted) {
      return;
    }
    this.context ??= new AudioContext();
    const frequencies = {
      step: 180,
      confirm: 420,
      battle: 140,
      hit: 260,
      capture: 520,
      badge: 660
    };
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.frequency.value = frequencies[kind];
    oscillator.type = "square";
    gain.gain.value = 0.04;
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start();
    oscillator.stop(this.context.currentTime + 0.08);
  }
}
