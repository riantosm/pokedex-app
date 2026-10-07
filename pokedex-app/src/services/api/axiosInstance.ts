import axios from 'axios';
import Config from 'react-native-config';

const FALLBACK_BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Satu-satunya HTTP client app. PokéAPI publik: tanpa token, tanpa interceptor auth.
 * Catatan: PokéAPI (Cloudflare) menolak request tanpa User-Agent — fetch/OkHttp/NSURLSession
 * di RN sudah mengirimnya secara otomatis.
 */
export const axiosInstance = axios.create({
  baseURL: Config.API_BASE_URL ?? FALLBACK_BASE_URL,
  timeout: 15_000,
  headers: { Accept: 'application/json' },
});
