import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncrytionService {

  constructor() { }

  private static secretEncrypt = 'B4m1Vd48d4c42c4dfdc0e19cg9e2GjDn';

  static decrypt(cipherTextBase64: string): string {

    const key = CryptoJS.enc.Utf8.parse(this.secretEncrypt);

    const decrypted = CryptoJS.AES.decrypt(
      {
        ciphertext: CryptoJS.enc.Base64.parse(cipherTextBase64)
      } as any,
      key,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

}
