import { FestivalDate } from "@/app/[locale]/(back-nav)/lineup/page";

export const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
export const API_IP = process.env.NEXT_PUBLIC_API_IP as string;

export const COOKIE_KEYS = {
  accessToken: "access-token",
  refreshToken: "refresh-token",
} as const;

export const API_ROUTES = {
  user: {
    me: "/user",
    login: "/user/login",
    signup: (token: string) => `/user/${token}`,
    /**
     * @name POST /user/reissue
     * @description 토큰 재발급
     * @body {string} refreshToken - 리프레시 토큰
     * @returns {string} accessToken - 엑세스 토큰
     * @returns {string} refreshToken - 리프레시 토큰
     */
    reissue: "/user/reissue",
    dku: {
      verify: "/user/dku/verify",
      reverify: "/user/dku/refresh",
    },
    sms: {
      send: (token: string) => `/user/sms/${token}`,
      verify: (token: string) => `/user/sms/verify/${token}`,
    },
    valid: (nickname: string) => `/user/valid?nickname=${nickname}`,
  },
  ticket: {
    /**
     * @name POST /ticket
     * @description 티켓 신청하기
     * @param {number} eventId - 행사 ID
     * @param {string} captchaKey - 캡차 키
     * @param {string} captchaValue - 캡차 값
     */
    apply: "/ticket",
    /**
     * @name GET /ticket/reservation/:eventId
     * @description 내 티켓 정보 조회
     * @param eventId - 행사 ID
     */
    reservation: (eventId: number) => `/ticket/reservation/${eventId}`,
    /**
     * @name GET /ticket/event
     * @description 행사 목록 조회
     * @returns {FestivalEvent[]} 행사 목록
     */
    event: "/ticket/event",
    /**
     * @name GET /ticket/:eventId
     * @description 내 티켓 조회
     * @param eventId - 행사 ID
     * @returns
     */
    myTicket: (eventId: number) => `/ticket/event/${eventId}`,
    captcha: {
      /**
       * @name GET /ticket/captcha/key
       * @description 캡차 키 발급
       * @returns {string} 캡차 키
       * @example
       * const key = await api.get(API_ROUTES.ticket.captcha.key);
       * console.log(key); // 'abc123'
       */
      key: "/ticket/captcha/key",
      /**
       * @name GET /ticket/captcha/image/:key
       * @description 캡차 이미지 조회
       * @param {string} key - 캡차 키
       * @returns {Buffer} 캡차 이미지
       * @example
       * const key = await api.get(API_ROUTES.ticket.captcha.key);
       * const image = await api.get(API_ROUTES.ticket.captcha.image(key));
       * console.log(image); // <Buffer 89 50 4e ...>
       */
      image: (key: string) => `/ticket/captcha/image/${key}`,
    },
  },
  lineup: {
    /**
     * @name GET /lineup
     * @description 라인업 조회
     * @returns {LineupInfo[]} 라인업 정보
     */
    list: (date: FestivalDate) => `/line-up?festivalDate=${date}`,
  },
} as const;
