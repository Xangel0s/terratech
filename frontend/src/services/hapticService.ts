'use client';

// Servicio de Háptica y Vibración para tablets rugerizadas y dispositivos móviles de faena

class HapticService {
  private hasVibration: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      this.hasVibration = typeof navigator.vibrate === 'function';
    }
  }

  // 1. Toque táctil ligero (clic en botón)
  public vibrateClick(): void {
    if (!this.hasVibration) return;
    try {
      navigator.vibrate(18);
    } catch {}
  }

  // 2. Pulso de confirmación exitosa
  public vibrateSuccess(): void {
    if (!this.hasVibration) return;
    try {
      navigator.vibrate(40);
    } catch {}
  }

  // 3. Patrón de advertencia preventiva
  public vibrateWarning(): void {
    if (!this.hasVibration) return;
    try {
      navigator.vibrate([60, 40, 60]);
    } catch {}
  }

  // 4. Parada de emergencia y bloqueo de flota
  public vibrateEmergency(): void {
    if (!this.hasVibration) return;
    try {
      navigator.vibrate([100, 50, 100, 50, 220]);
    } catch {}
  }
}

export const haptic = new HapticService();
