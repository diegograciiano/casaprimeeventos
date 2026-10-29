export const WHATSAPP_NUMBER = "5562993454663";
export const WHATSAPP_DISPLAY = "(62) 99345-4663";
export const INSTAGRAM_HANDLE = "casaprimeeventos";
export const INSTAGRAM_URL = "https://instagram.com/casaprimeeventos";

export function waLink(arg1: string, arg2?: string): string {
  if (arg2 !== undefined) {
    const cleanPhone = arg1.replace(/\D/g, "");
    const fullPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
    return `https://api.whatsapp.com/send/?phone=${fullPhone}&text=${encodeURIComponent(arg2)}`;
  }
  const clean = arg1.replace(/\D/g, "");
  if (clean.length >= 10 && !arg1.includes("\n") && !arg1.includes(" ") && !arg1.includes("🎉") && !arg1.includes("Olá")) {
    const fullPhone = clean.startsWith("55") ? clean : `55${clean}`;
    return `https://api.whatsapp.com/send/?phone=${fullPhone}`;
  }
  return `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(arg1)}`;
}
