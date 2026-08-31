/**
 * StudentStats: Energy (⚡), Health (❤️), University Economy (₹ Rupees), and Reputation (⭐)
 */
export class StudentStats {
  constructor(initialData = {}) {
    // Energy & Health (0 to 100)
    this.energy = initialData.energy !== undefined ? initialData.energy : 100;
    this.maxEnergy = 100;
    this.health = initialData.health !== undefined ? initialData.health : 100;
    this.maxHealth = 100;

    // Currency: ₹ Rupees
    this.money = initialData.money !== undefined ? initialData.money : 500; // Default ₹500 starting allowance

    // Rate of passive energy consumption
    this.energyDrainRate = 0.4; // % per minute of game time

    // Callbacks
    this.onEnergyChanged = null;
    this.onMoneyChanged = null;
  }

  update(delta, isSprinting = false, timeSystem = null) {
    // Passive energy drain over time
    let drain = delta * 0.5; // slow drain
    if (isSprinting) {
      drain += delta * 2.5; // sprinting drains energy faster
    }

    if (this.energy > 0) {
      this.energy = Math.max(0, this.energy - drain);
      if (this.onEnergyChanged) {
        this.onEnergyChanged(this.energy, this.maxEnergy);
      }
    }
  }

  consumeEnergy(amount, reason = '') {
    this.energy = Math.max(0, this.energy - amount);
    if (this.onEnergyChanged) {
      this.onEnergyChanged(this.energy, this.maxEnergy);
    }
    return this.energy;
  }

  restoreEnergy(amount, reason = '') {
    this.energy = Math.min(this.maxEnergy, this.energy + amount);
    if (this.onEnergyChanged) {
      this.onEnergyChanged(this.energy, this.maxEnergy);
    }
    return this.energy;
  }

  addMoney(amount, reason = '') {
    if (amount <= 0) return this.money;
    this.money += Math.round(amount);
    if (this.onMoneyChanged) {
      this.onMoneyChanged(this.money, amount, reason);
    }
    return this.money;
  }

  spendMoney(amount, reason = '') {
    if (this.money < amount) return false;
    this.money -= Math.round(amount);
    if (this.onMoneyChanged) {
      this.onMoneyChanged(this.money, -amount, reason);
    }
    return true;
  }

  canAfford(amount) {
    return this.money >= amount;
  }

  serialize() {
    return {
      energy: this.energy,
      health: this.health,
      money: this.money
    };
  }

  deserialize(data) {
    if (!data) return;
    if (data.energy !== undefined) this.energy = data.energy;
    if (data.health !== undefined) this.health = data.health;
    if (data.money !== undefined) this.money = data.money;
  }
}
