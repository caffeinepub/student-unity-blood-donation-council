import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface EmergencyRequest {
    hospital: string;
    requester: Principal;
    contactName: string;
    isActive: boolean;
    bloodGroup: BloodGroup;
    timestamp: Time;
    units: bigint;
    contactPhone: string;
}
export interface UserProfile {
    isMobilePublic: boolean;
    city: string;
    role: UserRole;
    universityId: string;
    fullName: string;
    mobileNumber: string;
    isVerified: boolean;
    bloodGroup: BloodGroup;
    lastDonation?: Time;
    donationCount: bigint;
}
export enum BloodGroup {
    aNegative = "aNegative",
    oPositive = "oPositive",
    abPositive = "abPositive",
    bPositive = "bPositive",
    aPositive = "aPositive",
    oNegative = "oNegative",
    abNegative = "abNegative",
    bNegative = "bNegative"
}
export enum UserRole {
    both = "both",
    recipient = "recipient",
    donor = "donor"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    confirmDonation(donor: Principal): Promise<void>;
    createEmergencyRequest(request: EmergencyRequest): Promise<bigint>;
    deactivateEmergencyRequest(id: bigint): Promise<void>;
    getActiveRequests(): Promise<Array<EmergencyRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchDonors(bloodGroup: BloodGroup | null, city: string | null): Promise<Array<UserProfile>>;
    updateEmergencyRequest(id: bigint, request: EmergencyRequest): Promise<void>;
    verifyDonor(user: Principal): Promise<void>;
}
