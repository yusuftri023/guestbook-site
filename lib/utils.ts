import { clsx, type ClassValue } from "clsx";
import ms from "ms";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timeAgo = (
  timestamp: Date,
  timeOnly?: boolean,
  longFormat: boolean | undefined = false,
): string => {
  if (!timestamp) return "never";
  return `${ms(Date.now() - new Date(timestamp).getTime(), { long: longFormat })}${
    timeOnly ? "" : " ago"
  }`;
};
export const timeRemaining = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return "never";
  return `${ms(new Date(timestamp).getTime() - Date.now(), { long: true })}${
    timeOnly ? "" : " Remaining"
  }`;
};

export const msToTimeString = (duration: number) => {
  const years = Math.floor(duration / 31_557_600_000);
  const months = Math.floor((duration % 31_557_600_000) / 2_592_000_000);
  const days =
    years < 0 && months < 0
      ? Math.floor(((duration % 31_557_600_000) % 2_592_000_000) / 86_400_000)
      : 0;
  if (Math.floor(duration / 2_592_000_000) < 1) return "Less than a month";
  return `${years ? `${years} Years` : ""}${months ? ` ${months} Months` : ""}${days ? ` ${days} Days` : ""}`;
};

export const timeAgoEstimate = (timestamp: Date) => {
  if (!timestamp) return "never";
  const difference = Date.now() - new Date(timestamp).getTime();
  const year = Math.floor(difference / 31_557_600_000);
  const month = Math.floor(difference / 2_592_000_000);
  const week = Math.floor(difference / 604_800_000);
  const day = Math.floor(difference / 86_400_000);
  if (year > 0) return year > 1 ? `${year} Years ago` : `Last Year`;
  if (month > 0) return month > 1 ? `${month} Months ago` : `Last Month`;
  if (week > 0) return week > 1 ? `${week} Weeks ago` : `Last Week`;
  if (day > 0) return day > 1 ? `${day} Days ago` : `Yesterday`;
  return "Today";
};

export const msToTime = (duration: number) => {
  const minutes = Math.floor(duration / 60_000);
  const seconds = Math.floor((duration % 60_000) / 1000);
  return `${minutes ? `${minutes} Minutes` : ""} ${
    seconds ? `${seconds} Seconds` : ""
  }`;
};

export const formatDate = (date: Date, style?: "long" | "short" | "medium") => {
  const newDate = new Date(date);
  const day = newDate.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[newDate.getMonth()];
  const year = newDate.getFullYear();
  if (style === "short") return `${month}/${year}`;
  if (style === "medium") return `${day}/${month}/${year}`;
  // Get hours and minutes in 2-digit format
  const hours = String(newDate.getHours()).padStart(2, "0");
  const minutes = String(newDate.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year} ${hours}.${minutes}`;
};

export const transformMstoTimeString = (timeInMS: number) => {
  const seconds = Math.floor(timeInMS / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const output = `${hours.toString().padStart(2, "0")}:${(minutes % 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  return output;
};

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }

  return res.json();
}

export function nFormatter(num: number, digits?: number) {
  if (!num) return "0";
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0";
}

export function capitalize(str: string) {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};

export function isValidHttpUrl(string: string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
export const formatRupiah = (
  number: number,
  country: string | undefined = "id",
) => {
  return new Intl.NumberFormat(country, {
    style: "currency",
    currency: "idr",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(number);
};

export class RateLimiter {
  windowStart: number;
  windowSize: number;
  maxRequests: number;
  idToRequestCount: Map<string, number>;

  constructor(config: { windowSize: number; maxRequests: number }) {
    this.windowStart = Date.now();
    this.windowSize = config.windowSize;
    this.maxRequests = config.maxRequests;
    this.idToRequestCount = new Map<string, number>();
  }

  limit(id: string) {
    const now = Date.now();

    // Check and update current window
    const isNewWindow = now - this.windowStart > this.windowSize;
    if (isNewWindow) {
      this.windowStart = now;
      this.idToRequestCount.set(id, 0);
    }

    // Check and update current request limits
    const currentRequestCount = this.idToRequestCount.get(id) ?? 0;

    if (currentRequestCount >= this.maxRequests) return true;

    this.idToRequestCount.set(id, currentRequestCount + 1);

    return false;
  }
}

export const transformToGoogleLink = (link: string) => {
  const googleDriveLink = "https://drive.google.com/file/d/";
  if (link.startsWith(googleDriveLink)) {
    const removeFront = link.slice(googleDriveLink.length);
    const id = removeFront.slice(
      0,
      removeFront.indexOf("/") === -1
        ? removeFront.length
        : removeFront.indexOf("/"),
    );
    const newLink = `https://lh3.googleusercontent.com/d/${id}`;
    return newLink;
  }
  return link;
};

export function getServerBaseUrl() {
  const BASE_URL =
    process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
      ? "https://admin.apotekerplus.com/api/job-portal"
      : process.env.NEXT_PUBLIC_ENVIRONMENT === "staging"
        ? "https://apoteker-admin.vercel.app/api/job-portal"
        : "http://localhost:3011/api/job-portal";
  return BASE_URL;
}
