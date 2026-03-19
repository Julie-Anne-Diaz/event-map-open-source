import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../api/fetchEvents";

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
}
