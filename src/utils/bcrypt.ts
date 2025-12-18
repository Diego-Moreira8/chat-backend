import bcrypt from "bcrypt";

async function encryptPassword(plaintextPassword: string) {
  try {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash;
  } catch (error) {
    console.error("Error on hashing password");
    throw error;
  }
}

async function comparePassword(
  plaintextPassword: string,
  encryptedPassword: string
) {
  try {
    const result = await bcrypt.compare(plaintextPassword, encryptedPassword);
    return result;
  } catch (error) {
    console.error("Error on comparing password");
    throw error;
  }
}

export { encryptPassword, comparePassword };
