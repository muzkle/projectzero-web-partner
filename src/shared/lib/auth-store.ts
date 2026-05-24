const REFRESH_TOKEN_KEY = 'pz_partner_refresh_token';
const PARTNER_ID_KEY = 'pz_partner_id';

let accessToken: string | null = null;
let partnerId: string | null = localStorage.getItem(PARTNER_ID_KEY);

export const authStore = {
  getAccessToken: () => accessToken,
  setAccessToken: (token: string | null) => {
    accessToken = token;
  },
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string | null) => {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
  getPartnerId: () => partnerId,
  setPartnerId: (id: string | null) => {
    partnerId = id;
    if (id) {
      localStorage.setItem(PARTNER_ID_KEY, id);
    } else {
      localStorage.removeItem(PARTNER_ID_KEY);
    }
  },
  clear: () => {
    accessToken = null;
    partnerId = null;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(PARTNER_ID_KEY);
  },
  isAuthenticated: () => Boolean(accessToken || authStore.getRefreshToken()),
};
