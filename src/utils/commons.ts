export function formatRupiah(amount?: string | number | null): string | undefined {
  if (!amount) return undefined;

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(amount));
}
