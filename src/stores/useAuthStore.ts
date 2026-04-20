import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import type { AuthStoreType } from "@/types/store.type";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { create } from "zustand";

export const useAuthStore = create<AuthStoreType>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  clearState: () => {
    set({
      accessToken: null,
      user: null,
      loading: false,
    });
  },

  handleError: (error, message) => {
    if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(errorMessage);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(message);
      }
  },

  signIn: async ({email, password}) => {
    try {
      set({ loading: true });
      const result = await authService.signIn({email, password});
      const accessToken = result?.accessToken;
      
      if (accessToken) {
        get().setAccessToken(accessToken);
        await get().getUser();
        toast.success('Đăng nhập thành công');
        return true;
      }

      return false;
    } catch (error) {
      get().handleError(error, 'Có lỗi xảy ra khi đăng nhập')
      return false;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async ({email, fullName, password}) => {
    try {
      set({ loading: true });
      await authService.signUp({email, fullName, password});
      toast.success("Đăng ký tài khoản thành công");
      return true;
    } catch (error) {
      get().handleError(error, 'Có lỗi xảy ra khi đăng ký')
      return false;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      get().clearState();
      await authService.signOut();
      toast.success("Đăng xuất thành công");
    } catch (error) {
      
      get().handleError(error, 'Có lỗi xảy ra khi đăng xuất')
    } finally {
      set({ loading: false });
    }
  },

  getUser: async () => {
    try {
      set({ loading: true });
      console.log(get().accessToken)
      const user = await userService.fetchUser();
      if (!user) return;

      set({ user });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  setAccessToken: (token) => {
    if(token)
      set({ accessToken: token });
  },

  refresh: async () => {
    try {
      set({ loading: true });
      const { user, getUser } = get();
      const accessToken = await authService.refresh();
      console.log('store', accessToken)
      get().setAccessToken(accessToken);

      if (!user) {
        await getUser();
      }

      return true;
    } catch (error) {
      console.error(error);
      get().clearState();
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));