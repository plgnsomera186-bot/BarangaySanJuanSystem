export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  contactNo: string;
  address: string;
  purok: string;
  street?: string;
  houseNo?: string;
  civilStatus: 'Single' | 'Married' | 'Divorce' | 'Widowed';
  isRegisteredVoter: boolean;
  role: 'resident' | 'admin';
  status: 'Pending' | 'Approved' | 'Rejected';
  requestDate: string;
  avatarUrl: string;
  password?: string;
  temporaryPassword?: string;
}

export interface DocumentRequestItem {
  id: string;
  residentId: string;
  fullName: string;
  profileUrl: string;
  contactNo: string;
  address: string;
  documentType: string;
  status: 'Pending' | 'In Process' | 'Ready for Pickup' | 'Completed' | 'Rejected';
  isArchived: boolean;
  purpose: string;
  dateRequested: string;
  pickupPeriod: string;
  controlNo: string;
  remarks?: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  eventTime?: string;
  imageUrl?: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
  comments: Array<{
    id: string;
    author: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
  }>;
}

export interface ResidentMessageItem {
  id: string;
  residentId: string;
  residentName: string;
  residentAvatar: string;
  contactNo: string;
  message: string;
  category: string;
  status: 'Pending' | 'Under Review' | 'Resolved';
  createdAt: string;
  replies?: Array<{
    id: string;
    sender: string;
    message: string;
    createdAt: string;
  }>;
}

export interface StatsOverview {
  totalPopulation: number;
  pendingApprovals: number;
  pendingDocuments: number;
  totalDocuments: number;
  totalMessages: number;
  registeredVoters: number;
}
