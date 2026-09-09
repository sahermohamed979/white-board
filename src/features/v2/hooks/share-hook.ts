import { useMutation } from "@tanstack/react-query";
import {
  CreateShareLinkApiResponse,
  CreateShareLinkVariables,
} from "@/src/features/v1/types/share.types";

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
      console.log("response Data", responseData);

      if (!responseData.status) {
        throw new Error(responseData.message ?? "Failed to create share link");
      }

      return responseData;
    },
  });

  return createLinkMutation;
}
