import * as SecureStore from "expo-secure-store";

export async function saveSession(key: string, value: string) {
  const chunkSize = 2048;
  const numChunks = Math.ceil(value.length / chunkSize);
  for (let i = 0; i < numChunks; i++) {
    const chunk = value.slice(i * chunkSize, (i + 1) * chunkSize);
    await SecureStore.setItemAsync(`${key}_chunk${i}`, chunk);
  }
  await SecureStore.setItemAsync(`${key}_numChunks`, numChunks.toString());
}

export async function getSession(key: string) {
  const numChunks = parseInt(
    (await SecureStore.getItemAsync(`${key}_numChunks`)) || "0"
  );
  let value = "";
  for (let i = 0; i < numChunks; i++) {
    const chunk = await SecureStore.getItemAsync(`${key}_chunk${i}`);
    value += chunk;
  }
  return value;
}
