
export const UsernameValidationConfig = {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_-]+$/,
  };
  
  export const validateUsername = (userName: string): string | null => {
    if (userName.length < UsernameValidationConfig.minLength) {
      return `Username must be at least ${UsernameValidationConfig.minLength} characters long`;
    }
    if (userName.length > UsernameValidationConfig.maxLength) {
      return `Username must be no more than ${UsernameValidationConfig.maxLength} characters long`;
    }
    if (!UsernameValidationConfig.pattern.test(userName)) {
      return 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    return null;
  };

