export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'dealer';
  avatar?: string;
}

export interface Dealer {
  id: string;
  name: string;
  country: string;
  region: string;
  contactEmail: string;
  contactPhone: string;
  status: 'active' | 'inactive' | 'pending';
  assignedCategories: string[];
  createdAt: string;
}

export type ContentType = 'document' | 'image' | 'video' | 'brochure' | '3d-model';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  category: string;
  tags: string[];
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  updatedAt: string;
  visibility: 'all-dealers' | 'selected-dealers' | 'internal';
  assignedDealers: string[];
  downloadCount: number;
  thumbnailUrl?: string;
  boatModel?: string;
  language: string;
  version: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  contentCount: number;
  icon?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  details?: string;
}

export interface DashboardStats {
  totalContent: number;
  totalDealers: number;
  totalDownloads: number;
  activeCategories: number;
  recentUploads: number;
  pendingDealers: number;
}
