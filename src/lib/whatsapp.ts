export const WHATSAPP_NUMBER = "5562993454663";
export const WHATSAPP_DISPLAY = "(62) 99345-4663";
export const INSTAGRAM_HANDLE = "casaprimeeventos";
export const INSTAGRAM_URL = "https://instagram.com/casaprimeeventos";

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
