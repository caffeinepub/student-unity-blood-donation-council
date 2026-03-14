import Map "mo:core/Map";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type BloodGroup = {
    #aPositive;
    #aNegative;
    #bPositive;
    #bNegative;
    #abPositive;
    #abNegative;
    #oPositive;
    #oNegative;
  };

  public type UserRole = {
    #donor;
    #recipient;
    #both;
  };

  public type UserProfile = {
    fullName : Text;
    mobileNumber : Text;
    universityId : Text;
    bloodGroup : BloodGroup;
    city : Text;
    lastDonation : ?Time.Time;
    role : UserRole;
    isMobilePublic : Bool;
    isVerified : Bool;
    donationCount : Nat;
  };

  module UserProfile {
    public func compare(p1 : UserProfile, p2 : UserProfile) : Order.Order {
      Text.compare(p1.fullName, p2.fullName);
    };
  };

  public type EmergencyRequest = {
    bloodGroup : BloodGroup;
    hospital : Text;
    units : Nat;
    contactName : Text;
    contactPhone : Text;
    requester : Principal;
    timestamp : Time.Time;
    isActive : Bool;
  };

  let profiles = Map.empty<Principal, UserProfile>();
  let requests = Map.empty<Nat, EmergencyRequest>();
  var requestIdCounter = 0;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Allow users to view their own profile, or admins to view any profile
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  public shared ({ caller }) func createEmergencyRequest(request : EmergencyRequest) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create emergency requests");
    };
    let id = requestIdCounter;
    requestIdCounter += 1;
    let newRequest = {
      request with
      requester = caller;
      timestamp = Time.now();
      isActive = true;
    };
    requests.add(id, newRequest);
    id;
  };

  public shared ({ caller }) func updateEmergencyRequest(id : Nat, request : EmergencyRequest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update emergency requests");
    };
    switch (requests.get(id)) {
      case (null) { Runtime.trap("Request does not exist") };
      case (?existing) {
        // Only the requester or an admin can update the request
        if (existing.requester != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own requests");
        };
        let updatedRequest = {
          request with
          requester = existing.requester;
          timestamp = existing.timestamp;
        };
        requests.add(id, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func deactivateEmergencyRequest(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deactivate emergency requests");
    };
    switch (requests.get(id)) {
      case (null) { Runtime.trap("Request does not exist") };
      case (?existing) {
        // Only the requester or an admin can deactivate the request
        if (existing.requester != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only deactivate your own requests");
        };
        let updated = {
          existing with
          isActive = false;
        };
        requests.add(id, updated);
      };
    };
  };

  public query ({ caller }) func getActiveRequests() : async [EmergencyRequest] {
    // Anyone including guests can view active emergency requests
    requests.values().toArray().filter(
      func(r) { r.isActive }
    );
  };

  public query ({ caller }) func searchDonors(bloodGroup : ?BloodGroup, city : ?Text) : async [UserProfile] {
    // Anyone including guests can search for donors
    profiles.values().toArray().filter(
      func(profile) {
        let matchesBlood = switch (bloodGroup) {
          case (null) { true };
          case (?bg) { profile.bloodGroup == bg };
        };
        let matchesCity = switch (city) {
          case (null) { true };
          case (?c) { profile.city == c };
        };
        profile.role != #recipient and matchesBlood and matchesCity
      }
    );
  };

  public shared ({ caller }) func confirmDonation(donor : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can confirm donations");
    };
    // Only the donor themselves can confirm their own donation
    if (caller != donor) {
      Runtime.trap("Unauthorized: Can only confirm your own donation");
    };
    switch (profiles.get(donor)) {
      case (null) { Runtime.trap("Donor profile does not exist") };
      case (?profile) {
        let updated = {
          profile with
          lastDonation = ?Time.now();
          donationCount = profile.donationCount + 1;
        };
        profiles.add(donor, updated);
      };
    };
  };

  public shared ({ caller }) func verifyDonor(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can verify donors");
    };
    switch (profiles.get(user)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?profile) {
        let updated = {
          profile with isVerified = true;
        };
        profiles.add(user, updated);
      };
    };
  };
};
