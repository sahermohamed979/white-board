import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CreateShareLinkApiResponse,
  
  CreateShareLinkVariables,
  SharedBoardPayload,
} from "@/src/features/v1/types/share.types";
import { ApiResponse } from "@/src/shared/types/response-types";

export function useCreateShareLink() {
  const createLinkMutation = useMutation<
    CreateShareLinkApiResponse,
    Error,
    CreateShareLinkVariables
  >({
    mutationFn: async ({ boardId, data }) => {
      const response = await fetch(`/api/boards/${boardId}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
        }),
      });
      const responseData = await response.json();

      if (!responseData.status) {
        throw new Error(responseData.message ?? "Failed to create share link");
      }

      return responseData;
    },
  });

  return createLinkMutation;
}

export function useRevalidateLink(token: string) {
  const revalidateLink = useQuery({
    queryKey: ["share-link", token],
    queryFn: async () => {
      const response = await fetch(`/api/share/${token}`);
      const data :ApiResponse<SharedBoardPayload>  = await response.json();
      if (!data.status) {
        throw new Error(data.message ?? "Failed to load share link");
      }
     
      return data.payload  ;
    },
    retry: 1,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!token,
    staleTime: 60 * 60 * 1000,
  });

  return revalidateLink;
}
