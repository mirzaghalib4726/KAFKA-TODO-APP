import { pbkdf2Sync } from 'crypto';

class Utils {
  generateHash(password) {
    const hash = pbkdf2Sync(
      password,
      process.env.SALT,
      10,
      20,
      'sha256',
    ).toString('hex');
    return hash;
  }

  compaireHash(password, hashPass) {
    const hash = pbkdf2Sync(
      password,
      process.env.SALT,
      10,
      20,
      'sha256',
    ).toString('hex');
    if (hashPass.localeCompare(hash) == 0) {
      return true;
    } else {
      return false;
    }
  }
}

export default new Utils();
