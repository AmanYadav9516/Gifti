// Web Audio API Synthesizer for 100% Zero-Latency, Guaranteed Offline Audio Effects
// No external MP3 downloads required!

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientInterval: number | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbient();
    }
  }

  // 1. Magical Sparkle Chime
  public playSparkle() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // C5 to G6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.05);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + index * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + index * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.05 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.05);
        osc.stop(ctx.currentTime + index * 0.05 + 0.6);
      });
    } catch {
      // Audio context fallback
    }
  }

  // 2. Unbox / Celebration Fanfare
  public playUnbox() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const chord = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C major triumph
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.03);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + idx * 0.03 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.03 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.03);
        osc.stop(ctx.currentTime + idx * 0.03 + 1.3);
      });
    } catch {
      // Audio fallback
    }
  }

  // 3. Heartbeat Pulse
  public playHeartbeat() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      [0, 0.2].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(i === 0 ? 65 : 55, ctx.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + delay + 0.15);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.2);
      });
    } catch {
      // Audio fallback
    }
  }

  // 4. Candle Extinguish & Firework Pop
  public playCandleExtinguish() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      // White noise puff
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(ctx.currentTime);

      // Subsequent celebration chime
      setTimeout(() => this.playSparkle(), 250);
    } catch {
      // Audio fallback
    }
  }

  // 5. Wax Seal Breaking Sound
  public playWaxSealBreak() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio fallback
    }
  }

  // 6. Generative Ambient World Soundscapes
  public playAmbient(theme: string) {
    if (this.isMuted) return;
    this.stopAmbient();
    try {
      const ctx = this.getContext();
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.01, ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 2);
      this.ambientGain.connect(ctx.destination);

      const scale = theme === 'galaxy' 
        ? [220, 277.18, 329.63, 440, 554.37] // A minor cosmic
        : theme === 'festive' || theme === 'rakhi'
        ? [293.66, 329.63, 369.99, 440, 493.88, 587.33] // Indian D major / Raag Bhupali vibe
        : [261.63, 293.66, 329.63, 392.00, 440, 523.25]; // Warm C major

      let noteIndex = 0;
      this.ambientInterval = window.setInterval(() => {
        if (!this.ambientGain || this.isMuted) return;
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        
        const freq = scale[noteIndex % scale.length];
        noteIndex = (noteIndex + 1 + Math.floor(Math.random() * 2)) % scale.length;

        osc.type = theme === 'rainy' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        noteGain.gain.setValueAtTime(0.001, ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.8);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);

        osc.connect(noteGain);
        noteGain.connect(this.ambientGain);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 3.0);
      }, 1600);

    } catch {
      // Audio fallback
    }
  }

  public stopAmbient() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          this.ambientGain?.disconnect();
          this.ambientGain = null;
        }, 500);
      } catch {
        this.ambientGain = null;
      }
    }
  }
}

export const sounds = new SoundEngine();
