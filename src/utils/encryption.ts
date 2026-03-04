import CryptoJS from 'crypto-js';

const KEY_3DES = 'langenterakMyGwqeKVEQjUi';

export function encryptScoreData(transcript: string, score: number, recordTime: number): string {
  const plainText = `${transcript}|${score}|${recordTime}`;
  return CryptoJS.TripleDES.encrypt(plainText, KEY_3DES).toString();
}
