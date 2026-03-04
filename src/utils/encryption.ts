import CryptoJS from 'crypto-js';
import Constants from 'expo-constants';

const KEY_3DES = Constants.expoConfig?.extra?.tripleDesKey ?? '';

export function encryptScoreData(transcript: string, score: number, recordTime: number): string {
  const plainText = `${transcript}|${score}|${recordTime}`;
  return CryptoJS.TripleDES.encrypt(plainText, KEY_3DES).toString();
}
