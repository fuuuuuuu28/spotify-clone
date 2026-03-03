import { getChatHistory, reqChatbot } from "@/lib/actions/chatbot-actions";
import { Message } from "@/types/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useChatHistory() {
  return useQuery({
    queryKey: ["chatbot"],
    queryFn: getChatHistory,
    staleTime: 0,
  });
}

export function useAskToChatbot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ask-chatbot"],
    mutationFn: async (prompt: string) => {
      return reqChatbot(prompt);
    },
    onMutate: async (prompt:string) => {
      await queryClient.cancelQueries({ queryKey: ["chatbot"] });

      const prev = queryClient.getQueryData<any>(["chatbot"]);
      const optimisticMessage = {
        _id: `temp-${Date.now()}`,
        role: "user",
        content: prompt,
      };

      queryClient.setQueryData(["chatbot"], [
        ...prev,
        optimisticMessage,
      ]);

      return { prev };
    },
    onError: (err, prompt, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["playlist"], ctx.prev);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist"] });
    },
  });
}
