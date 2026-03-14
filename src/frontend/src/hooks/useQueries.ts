import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BloodGroup, EmergencyRequest, UserProfile } from "../backend";
import { useActor } from "./useActor";

export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useActiveRequests() {
  const { actor, isFetching } = useActor();
  return useQuery<EmergencyRequest[]>({
    queryKey: ["activeRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveRequests();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useSearchDonors(
  bloodGroup: BloodGroup | null,
  city: string | null,
  enabled: boolean,
) {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["searchDonors", bloodGroup, city],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchDonors(bloodGroup, city);
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("No actor");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

export function useCreateRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (request: EmergencyRequest) => {
      if (!actor) throw new Error("No actor");
      return actor.createEmergencyRequest(request);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeRequests"] });
    },
  });
}

export function useDeactivateRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deactivateEmergencyRequest(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeRequests"] });
    },
  });
}
