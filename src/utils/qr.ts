export function generateQRValue(shelfId: string): string {
  return `inventqry://shelf/${shelfId}`;
}

export function parseQRValue(qrValue: string): string | null {
  const prefix = 'inventqry://shelf/';
  if (qrValue.startsWith(prefix)) {
    return qrValue.slice(prefix.length);
  }
  return null;
}
