const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateId(): string {
  const timestamp = Date.now().toString(36);
  let random = '';
  for (let i = 0; i < 8; i++) {
    random += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return `${timestamp}-${random}`;
}

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
