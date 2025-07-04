import React from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api.js"; // Adjust the import path as necessary

const useSignUp = () => {
  
    const queryClient = useQueryClient();

    const { mutate, isPending, error } = useMutation({
        mutationFn: signup,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }),
    });

    return { error, isPending, signupMutation: mutate };

}

export default useSignUp