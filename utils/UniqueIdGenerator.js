function getRandomInt(min, max) {
  min = Math.ceil(min);   
  max = Math.floor(max); 
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateUniqueId = ({length = 6, prefix = '', alphanumeric = true} = {}) => {
  const ALNUM = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const DIGITS = "0123456789";

  let suffix = "";

  if (alphanumeric) {
    for (let i = 0; i < length; i++) {
      const idx = getRandomInt(0, ALNUM.length - 1);
      suffix += ALNUM.charAt(idx);
    }
  } else {
    for (let i = 0; i < length; i++) {
      const idx = getRandomInt(0, DIGITS.length - 1);
      suffix += DIGITS.charAt(idx);
    }
  }

  return `${prefix}${suffix}`;
};