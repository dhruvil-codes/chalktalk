export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'aspirant' | 'current-student' | 'alumni';
  university?: string;
  course?: string;
  yearOfStudy?: number;
  graduationYear?: number;
  bio?: string;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileSetupData {
  personalDetails: {
    firstName: string;
    lastName: string;
    bio: string;
  };
  academicInfo: {
    university: string;
    course: string;
    yearOfStudy: number;
    graduationYear?: number;
  };
  role: 'aspirant' | 'current-student' | 'alumni';
  avatar?: File;
}

export interface ValidationErrors {
  [key: string]: string;
}