
import { User, TimeSlot, UserRole, Gender, StaffStatus } from './types';

const USERS_KEY = 'tss_users_v4_master';
const SLOTS_KEY = 'tss_slots_v4_master';

const INITIAL_ADMIN: User = {
  id: 'admin-1',
  fullName: 'System Administrator',
  email: 'admin@tss.com',
  password: 'admin',
  gender: Gender.OTHER,
  whatsapp: '+123456789',
  role: UserRole.ADMIN,
  isBlocked: false,
  registrationDate: new Date().toISOString()
};

export class DB {
  static getUsers(): User[] {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      const initial = [INITIAL_ADMIN];
      localStorage.setItem(USERS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  }

  static setUsers(users: User[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  static getSlots(): TimeSlot[] {
    const data = localStorage.getItem(SLOTS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  }

  static setSlots(slots: TimeSlot[]) {
    localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
  }

  static addUser(user: User) {
    const users = this.getUsers();
    if (users.some(u => u.email === user.email)) {
        alert("This email is already registered.");
        return false;
    }
    users.push({
      ...user,
      registrationDate: user.registrationDate || new Date().toISOString()
    });
    this.setUsers(users);
    return true;
  }

  static updateUser(userId: string, updates: Partial<User>) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      this.setUsers(users);
      return true;
    }
    return false;
  }

  static deleteUser(userId: string) {
    const users = this.getUsers().filter(u => u.id !== userId);
    this.setUsers(users);
  }

  static addSlot(slot: TimeSlot) {
    const slots = this.getSlots();
    slots.push(slot);
    this.setSlots(slots);
  }

  static updateSlot(slotId: string, updates: Partial<TimeSlot>) {
    const slots = this.getSlots();
    const idx = slots.findIndex(s => s.id === slotId);
    if (idx !== -1) {
      slots[idx] = { ...slots[idx], ...updates };
      this.setSlots(slots);
    }
  }

  static deleteSlot(slotId: string) {
    const slots = this.getSlots().filter(s => s.id !== slotId);
    this.setSlots(slots);
  }
}
