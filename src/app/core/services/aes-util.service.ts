import { Injectable } from '@angular/core';
import { CONSTANTS, CRYPTO_CONST } from 'src/app/core/constants';

import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AesUtilService {
  private _keySize = CRYPTO_CONST.keySize;
  private _iterationCount = CRYPTO_CONST.iterationCount;

  constructor() { }

  generateKey(sa: string, password: string): CryptoJS.lib.WordArray {
    var key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(sa),
      { keySize: this._keySize, iterations: this._iterationCount });
    return key;
  }

  decrypt(message: string): string {
    var key = this.generateKey(CONSTANTS.IVSA, CONSTANTS.KEY);
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(message)
    });
    console.log(cipherParams)
    var decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: CryptoJS.enc.Hex.parse(CONSTANTS.IVSA)
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  encrypt(message: string): string {
    var key = this.generateKey(CONSTANTS.IVSA, CONSTANTS.KEY);
    var encrypted = CryptoJS.AES.encrypt(message, key, {
      iv: CryptoJS.enc.Hex.parse(CONSTANTS.IVSA)
    });
    return encrypted.toString();
  }
}
