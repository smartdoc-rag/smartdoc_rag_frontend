import type { AuthParams } from "./auth.type";
import type { User } from "./user.type";

export interface AuthStoreType {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  signIn: (param: AuthParams) => Promise<boolean>;

  signUp: ({email, password} : AuthParams) => Promise<boolean>;

  signOut: () => Promise<void>;

  getUser: () => Promise<void>;

  setAccessToken: (token: string | undefined) => void;

  refresh: () => Promise<boolean>;

  clearState: () => void;

  handleError: (error: unknown, message: string) => void;
}