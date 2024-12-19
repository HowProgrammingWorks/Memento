'use strict';

// Memento: Captures and stores the state of the Originator

class InventorySnapshot {
  constructor(state) {
    this.state = state;
  }

  getState() {
    return this.state;
  }
}

// Originator: The object whose state we want to save and restore

class Inventory {
  constructor() {
    this.items = {};
  }

  addItem(itemName, quantity) {
    if (this.items[itemName]) {
      this.items[itemName] += quantity;
    } else {
      this.items[itemName] = quantity;
    }
  }

  removeItem(itemName, quantity) {
    if (this.items[itemName]) {
      this.items[itemName] -= quantity;
      if (this.items[itemName] <= 0) {
        delete this.items[itemName];
      }
    }
  }

  showItems() {
    console.log('Current Inventory:\n ', this.items);
  }

  save() {
    return new InventorySnapshot({ ...this.items });
  }

  restore(snapshot) {
    this.items = snapshot.getState();
  }
}

// Caretaker: Manages snapshots for the Originator

class InventoryHistoryManager {
  constructor() {
    this.history = [];
  }

  saveSnapshot(inventory) {
    this.history.push(inventory.save());
  }

  restoreSnapshot(inventory) {
    if (this.history.length > 0) {
      const snapshot = this.history.pop();
      inventory.restore(snapshot);
    }
  }
}

// Usage

const inventory = new Inventory();
const historyManager = new InventoryHistoryManager();

// Initial items

inventory.addItem('keyboard', 10);
inventory.addItem('laptop', 5);
historyManager.saveSnapshot(inventory);

inventory.addItem('phone', 20);
inventory.addItem('router', 15);
historyManager.saveSnapshot(inventory);

inventory.addItem('mouse', 25);
inventory.showItems();

// Current Inventory:
// { keyboard: 10, laptop: 5, phone: 20, router: 15, mouse: 25 }

// Undo last addition

historyManager.restoreSnapshot(inventory);
inventory.showItems();

// Current Inventory:
// { keyboard: 10, laptop: 5, phone: 20, router: 15 }

// Undo another change

historyManager.restoreSnapshot(inventory);
inventory.showItems();

// Current Inventory:
// { keyboard: 10, laptop: 5 }
