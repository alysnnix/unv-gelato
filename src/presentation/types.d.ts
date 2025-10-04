export declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (momentListener?: (notification: any) => void) => void;
          cancel: () => void;
        };
      };
    };
    __googleOneTapInitialized?: boolean;
  }
}
