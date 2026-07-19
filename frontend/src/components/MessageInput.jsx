import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Image, Send, X, Smile } from "lucide-react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();
  const { socket } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTextChange = (e) => {
    setText(e.target.value);

    // Emit typing event
    if (socket && selectedUser) {
      socket.emit("typing", { receiverId: selectedUser._id });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", { receiverId: selectedUser._id });
      }, 2000);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    if (socket && selectedUser) {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      setShowEmojiPicker(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div
      className="flex flex-col w-full relative"
      style={{
        padding: "16px 24px",
        background: "var(--bg-tertiary)",
        borderTop: "1px solid var(--border-color)",
      }}
    >
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: "auto" }}
            exit={{ opacity: 0, scale: 0.8, height: 0 }}
            className="mb-4 flex items-center gap-2"
          >
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-[14px]"
                style={{ border: "1px solid var(--border-color)" }}
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ 
                  color: "var(--text-primary)", 
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  boxShadow: "var(--shadow-md)"
                }}
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSendMessage} className="flex items-center gap-3 w-full">
        <div className="flex-1 flex gap-2">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full rounded-full focus:outline-none transition-all duration-250"
              style={{
                padding: "14px 20px 14px 50px",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: "14px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--accent-primary)";
                e.target.style.boxShadow = "0 0 0 1px var(--accent-primary), var(--shadow-glow)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border-color)";
                e.target.style.boxShadow = "none";
              }}
              placeholder="Type your message..."
              value={text}
              onChange={handleTextChange}
            />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-[50px] h-full"
              ref={emojiPickerRef}
            >
              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="transition-colors hover:text-[var(--accent-primary)]"
                style={{ color: showEmojiPicker ? "var(--accent-primary)" : "var(--text-secondary)" }}
              >
                <Smile size={20} />
              </button>

              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10, pointerEvents: "none" }}
                    animate={{ opacity: 1, scale: 1, y: 0, pointerEvents: "auto" }}
                    exit={{ opacity: 0, scale: 0.95, y: 10, pointerEvents: "none" }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full left-0 mb-4 z-50 rounded-[24px] overflow-hidden"
                    style={{ 
                      filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))",
                      border: "1px solid var(--border-color)",
                      "--epr-bg-color": "var(--bg-secondary)",
                      "--epr-category-label-bg-color": "var(--bg-secondary)",
                      "--epr-hover-bg-color": "var(--bg-glass-hover)",
                      "--epr-border-color": "transparent",
                      "--epr-search-border-color": "var(--border-color)",
                      "--epr-search-input-bg-color": "var(--bg-tertiary)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)"
                    }}
                  >
                    <EmojiPicker 
                      onEmojiClick={onEmojiClick}
                      theme="dark"
                      previewConfig={{ showPreview: false }}
                      searchDisabled={false}
                      skinTonesDisabled={true}
                      height={420}
                      width={350}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center transition-colors"
            style={{
              color: imagePreview ? "var(--accent-primary)" : "var(--text-secondary)",
              background: imagePreview ? "var(--accent-glow)" : "var(--bg-tertiary)",
              border: imagePreview ? "1px solid var(--border-active)" : "1px solid transparent"
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={22} />
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            background: "var(--sent-bubble)",
            boxShadow: "var(--shadow-glow)"
          }}
        >
          <Send size={20} className="ml-0.5" />
        </motion.button>
      </form>
    </div>
  );
};

export default MessageInput;
