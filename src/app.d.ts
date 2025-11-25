declare global {
  namespace App {
    interface Locals {
      user?: {
        id: string;
        email: string;
        name: string;
        avatarColor: string;
        title?: string;
        timezone?: string;
        bio?: string;
        preferences: {
          weeklySummary: boolean;
          productUpdates: boolean;
        };
        createdAt: string;
        updatedAt: string;
      };
      session?: {
        access_token: string;
        userId: string;
        createdAt: string;
      };
    }
    interface PageData {
      user?: Locals["user"];
    }
  }
}

export {};
