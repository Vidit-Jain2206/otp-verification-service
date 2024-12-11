import {
  scryptSync,
  randomFillSync,
  createCipheriv,
  createDecipheriv,
} from "crypto";

const algorithm = "aes-192-cbc";
const password = "your-password";

// Encode function
export const encode = async (string: string): Promise<string> => {
  try {
    const key = scryptSync(password, "salt", 24);
    const iv = Buffer.from(randomFillSync(new Uint8Array(16)));
    const cipher = createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(string, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  } catch (error) {
    throw error;
  }
};

// Decode function
export const decode = async (encryptedString: string): Promise<string> => {
  try {
    const [ivHex, encrypted] = encryptedString.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const key = scryptSync(password, "salt", 24);
    const decipher = createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    throw error;
  }
};
