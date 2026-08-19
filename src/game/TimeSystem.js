/**
 * Day/Night Cycle and Campus Time Simulation
 */
export class TimeSystem {
  constructor(config = {}) {
    this.minutesPerSecond = config.minutesPerRealSecond || 2;
    this.hour = config.startHour !== undefined ? config.startHour : 8;
    this.minute = config.startMinute !== undefined ? config.startMinute : 30;
    this.day = 1;
    this.paused = false;
    this.ambientLightColor = 'rgba(0, 0, 0, 0)';
    this.ambientMode = 'day'; // 'day', 'evening', 'night'
    this.onTimeChangedCallbacks = [];
  }

  update(deltaSeconds) {
    if (this.paused) return;

    this.minute += this.minutesPerSecond * deltaSeconds;
    if (this.minute >= 60) {
      const addedHours = Math.floor(this.minute / 60);
      this.minute = this.minute % 60;
      this.hour += addedHours;

      if (this.hour >= 24) {
        this.hour = this.hour % 24;
        this.day += 1;
      }
    }

    this.updateAmbientLighting();
    this.notifyListeners();
  }

  updateAmbientLighting() {
    const totalMinutes = this.hour * 60 + this.minute;

    // 06:00 (360m) - Sunrise
    // 08:00 (480m) - Morning / Day start
    // 17:00 (1020m) - Afternoon end
    // 19:30 (1170m) - Sunset / Dusk
    // 21:00 (1260m) - Night start
    // 05:00 (300m) - Pre-dawn

    if (totalMinutes >= 360 && totalMinutes < 480) {
      // Dawn (06:00 - 08:00): Soft golden rise
      const progress = (totalMinutes - 360) / 120;
      const alpha = 0.4 * (1 - progress);
      this.ambientLightColor = `rgba(255, 170, 80, ${alpha.toFixed(2)})`;
      this.ambientMode = 'day';
    } else if (totalMinutes >= 480 && totalMinutes < 1020) {
      // Full Day (08:00 - 17:00): Clear daylight
      this.ambientLightColor = 'rgba(0, 0, 0, 0)';
      this.ambientMode = 'day';
    } else if (totalMinutes >= 1020 && totalMinutes < 1170) {
      // Golden Hour / Sunset (17:00 - 19:30)
      const progress = (totalMinutes - 1020) / 150;
      const alpha = progress * 0.45;
      this.ambientLightColor = `rgba(235, 110, 50, ${alpha.toFixed(2)})`;
      this.ambientMode = 'evening';
    } else if (totalMinutes >= 1170 && totalMinutes < 1260) {
      // Twilight / Dusk (19:30 - 21:00)
      const progress = (totalMinutes - 1170) / 90;
      const alpha = 0.35 + progress * 0.35;
      this.ambientLightColor = `rgba(30, 20, 70, ${alpha.toFixed(2)})`;
      this.ambientMode = 'night';
    } else {
      // Deep Night (21:00 - 06:00)
      this.ambientLightColor = 'rgba(10, 15, 45, 0.72)';
      this.ambientMode = 'night';
    }
  }

  isNightCanteenOpen() {
    // Unlocks after 10:00 PM (22:00) until 05:00 AM
    return this.hour >= 22 || this.hour < 5;
  }

  isSouthPartyActive() {
    // Active from 21:00 to 04:00
    return this.hour >= 21 || this.hour < 4;
  }

  sleepUntilMorning() {
    this.hour = 7;
    this.minute = 0;
    this.day += 1;
    this.updateAmbientLighting();
    this.notifyListeners();
  }

  getFormattedTime() {
    const h = Math.floor(this.hour);
    const m = Math.floor(this.minute);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const displayM = m < 10 ? `0${m}` : `${m}`;
    return `${displayH}:${displayM} ${period}`;
  }

  getTimePeriodName() {
    if (this.hour >= 5 && this.hour < 12) return 'Morning';
    if (this.hour >= 12 && this.hour < 17) return 'Afternoon';
    if (this.hour >= 17 && this.hour < 20) return 'Evening';
    return 'Night';
  }

  onTimeChanged(callback) {
    this.onTimeChangedCallbacks.push(callback);
  }

  notifyListeners() {
    const timeData = {
      hour: this.hour,
      minute: this.minute,
      day: this.day,
      formattedTime: this.getFormattedTime(),
      period: this.getTimePeriodName(),
      ambientMode: this.ambientMode,
      isNightCanteenOpen: this.isNightCanteenOpen(),
      isSouthPartyActive: this.isSouthPartyActive()
    };
    this.onTimeChangedCallbacks.forEach(cb => cb(timeData));
  }
}
