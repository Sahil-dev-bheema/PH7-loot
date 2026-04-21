import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../utils/axiosInstance";

const axiosBaseQuery =
  () =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
      });

      return { data: result.data };
    } catch (axiosError) {
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["UserProfile", "Wallet"],

  endpoints: (builder) => ({

    getUserProfile: builder.query({
      query: (userId) => ({
        url : `/user/user-profile/${userId}`,
      method :"GET",
      }),

      transformResponse: (res) => {
  const root = res?.data || {};

  return {
    user: root?.user || {},

    packages: Array.isArray(root?.package)
      ? root.package.map((p) => ({
          purchaseId: p.user_package_id,
          title: p.package_name,
          price: Number(p.package_price || 0),
          purchasedAt: p.purchased_at,
        }))
      : [],

    tickets: Array.isArray(root?.tickets) ? root.tickets : [],

    wallet: Number(root?.wallet || 0),
  };
},

      providesTags: ["UserProfile"],
    }),

    getWallet: builder.query({
      query: (userId) => ({
        url: `/user/get_wallet/${userId}`,
        method: "GET",
      }),

      transformResponse: (res) => {
const root = res || {};
const amount = Number(root.wallet || 0);
        return {
          cash: amount,
        
        };
      },

      providesTags: ["Wallet"],
    }),

    updateWallet: builder.mutation({
      query: ({ userId, amount }) => ({
        url: "/user/user-wallet-update",
        method: "POST",
        data: { userId, amount: Number(amount) },
      }),

      invalidatesTags: ["Wallet", "UserProfile"],
    }),
  }),
});

export const {
  useGetWalletQuery,
  useGetUserProfileQuery,
  useUpdateWalletMutation,
} = userApi;