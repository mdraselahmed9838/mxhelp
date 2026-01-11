
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  SUBSCRIBER = 'SUBSCRIBER'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum StaffStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum SlotShift {
  MORNING = 'Morning',
  AFTERNOON = 'Afternoon',
  EVENING = 'Evening',
  NIGHT = 'Night'
}

export interface PrivateNote {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  timestamp: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  gender: Gender;
  whatsapp: string;
  role: UserRole;
  isBlocked: boolean; // INACTIVE state
  
  preferredTimeSlotId?: string;
  assignedTimeSlotId?: string;
  
  status?: StaffStatus;
  agreement?: boolean;
  religion?: string;
  division?: string;
  education?: string;
  phoneNumber?: string;
  relationshipStatus?: string;
  deviceSelection?: string;
  birthOrder?: string;
  isRegularStudent?: boolean;
  usesImo?: string;
  phoneBrand?: string;
  phoneSpecs?: string;
  previousSites?: string;
  availableHours?: string;
  fbLink?: string;
  
  privateNotes?: PrivateNote[];
  displayName?: string;
}

export interface TimeSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  shift: SlotShift;
  teacherId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
