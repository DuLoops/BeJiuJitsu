// src/context/PostFormContext.tsx
import { createContext, useContext, useState } from 'react';
import { Post } from '../types/post';
import { useRouter } from 'expo-router';
type PostFormContextType = {
  formData: Partial<Post>;
  setFormData: (data: Partial<Post>) => void;
  handleSubmit: () => void;
};

const PostFormContext = createContext<PostFormContextType>({
  formData: {},
  setFormData: () => {},
  handleSubmit: () => {},
});

export function PostFormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<Partial<Post>>({});
  const router = useRouter();
    const submit = () => {
        console.log(formData);
        router.navigate('/profile');
    }
  return (
    <PostFormContext.Provider value={{
      formData,
      setFormData,
      handleSubmit: submit,
    }}>
      {children}
    </PostFormContext.Provider>
  );
}

export const usePostForm = () => useContext(PostFormContext);