/**
 * مشغل صوت جرس الحصص الإلكتروني باستخدام Web Audio API المدمج في المتصفح
 * لا يحتاج إلى أي ملفات صوتية خارجية ويعمل فوراً
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSchoolChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [
      { freq: 523.25, time: 0.0, dur: 0.4 },  // C5
      { freq: 659.25, time: 0.35, dur: 0.4 }, // E5
      { freq: 783.99, time: 0.7, dur: 0.5 },  // G5
      { freq: 1046.5, time: 1.1, dur: 0.8 },  // C6
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + note.time);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + note.time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + note.time + note.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + note.time);
      osc.stop(ctx.currentTime + note.time + note.dur);
    });
  } catch (e) {
    console.warn('Audio chime could not play due to browser policy', e);
  }
}
