import CryptoJS from "crypto-js";

export const subscribeToMessages = () => {
  const channel = supabase
    .from("userMessages")
    .on("INSERT", (payload) => {
      console.log("New message:", payload.new);
      // Update your message state with the new message
    })
    .subscribe();

  return () => {
    supabase.removeSubscription(channel);
  };
};

export const sendMessage = async (senderId, recipientId, message) => {
  const encryptedMessage = encryptMessage(message);

  const { error } = await supabase.from("userMessages").insert([
    {
      sender_id: senderId,
      recipient_id: recipientId,
      content: encryptedMessage,
    },
  ]);

  if (error) {
    console.error("Error sending message:", error);
  } else {
    console.log("Message sent successfully!");
  }
};

export const receiveMessages = async (recipientId) => {
  const { data, error } = await supabase
    .from("userMessages")
    .select("content")
    .eq("recipient_id", recipientId);

  if (error) {
    console.error("Error fetching messages:", error);
    return;
  }

  const decryptedMessages = data.map((message) =>
    decryptMessage(message.content)
  );
  return decryptedMessages;
};

const secretKey = "your-secret-key"; // Use a strong key for encryption

export const encryptMessage = (message) => {
  const encrypted = CryptoJS.AES.encrypt(message, secretKey).toString();
  return encrypted;
};

export const decryptMessage = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};
