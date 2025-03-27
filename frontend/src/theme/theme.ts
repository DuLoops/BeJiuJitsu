
export const colors = {
  // Main theme colors
    black: '#030712',      // black
    white: '#F9FAFB',     // white
    blue: '#2563EB',     // blue
    red: '#B91C1C',    // red
    lightBlue: '#93C5FD',     // light blue
    lightRed: '#EF4444',    // light red
 };
 

export const theme = {
  light: {
      black: colors.black,
      white: colors.white,
      primary: colors.black,
      secondary: colors.blue,
      accent: colors.red,
      background: {
        default: colors.white,
        surface: '#F3F4F6',
        elevated: '#FFFFFF',
      },
      text: {
        primary: colors.black,
        secondary: colors.white,
        blue: colors.blue,
        accent: colors.red,
        muted: '#6B7280',
      },
      border: {
        primary: '#000',
        secondary: colors.lightBlue,
        accent: colors.lightRed,
      },
      status: {
        error: colors.red,
        success: colors.blue,
      },
      button: {
        primary: {
          backgroundColor: colors.black,
          color: colors.white,
        },
        secondary: {
          backgroundColor: colors.blue,
          color: colors.white,
        },
        accent: {
          backgroundColor: colors.red,
          color: colors.white,
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: colors.black,
          borderWidth: 1,
          color: colors.black,
        } 
      }
  },
  dark: {
      black: colors.black,
      white: colors.white,
      primary: colors.white,
      secondary: colors.blue,
      accent: colors.red,
      background: {
        default: colors.black,
        surface: '#030712',
        elevated: '#374151',
      },
      text: {
        primary: colors.white,
        secondary: colors.black,
        blue: colors.blue,
        accent: colors.red,
        muted: '#9CA3AF',
      },
      border: {
        primary: '#fff',
        secondary: colors.lightBlue,
        accent: colors.lightRed,
      },
      status: {
        error: colors.red,
        success: colors.blue
      },
      button: {
        primary: {
          backgroundColor: colors.white,
          color: colors.black,
        },
        secondary: {
          backgroundColor: '#374151',
          color: colors.white,
        },
        accent: {
          backgroundColor: colors.red,
          color: colors.white,
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: colors.white,
          borderWidth: 1,
          color: colors.white,
        },
      }
  },
} as const;

export type Theme = {
    black: string;
    white: string;
    primary: string;
    secondary: string;
    accent: string;
    background: {
      default: string;
      surface: string;
      elevated: string;
    };
    text: {
      primary: string;
      secondary: string;
      blue: string;
      accent: string;
      muted: string;
    };
    border: {
      primary: string;
      secondary: string;
      accent: string;
    };
    status: {
      error: string;
      success: string;
    };
    button: {
      primary: {
        backgroundColor: string;
        color: string;
      };
      secondary: {
        backgroundColor: string;
        color: string;
      };
      accent: {
        backgroundColor: string;
        color: string;
      };
      outline: {
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
        color: string;
      };
    };
};

