import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../lib/api.js'; // Adjust the import path as necessary

const useAuthUser = () => {
  // tanstack query
  const authUser = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthUser,
    retry: false,
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
}

export default useAuthUser;