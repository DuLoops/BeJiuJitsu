export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export type ValidationError = {
  field: string;
  message: string;
};

export const validateAuthForm = (email: string, password: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!validateEmail(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }
  
  if (!validatePassword(password)) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }
  
  return errors;
};
