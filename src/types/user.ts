export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
  bio?: string;
  organization?: string;
  designation?: string;
  department?: string;
  location?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  publicProfileEnabled: boolean;
}

export type PublicUserProfile = Pick<
  UserProfile,
  | "uid"
  | "name"
  | "email"
  | "phone"
  | "profilePhoto"
  | "bio"
  | "organization"
  | "designation"
  | "department"
  | "location"
  | "website"
  | "publicProfileEnabled"
>;

export interface ProfileFormValues {
  name: string;
  phone?: string;
  bio?: string;
  organization?: string;
  designation?: string;
  department?: string;
  location?: string;
  website?: string;
  publicProfileEnabled: boolean;
}
