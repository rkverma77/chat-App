import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center relative overflow-hidden" style={{ background: "transparent" }}>


      <div className="max-w-2xl w-full mx-auto px-4 relative z-10" style={{ marginTop: "40px" }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="rounded-[24px]"
          style={{ 
            background: "var(--bg-secondary)", 
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-lg)",
            padding: "48px"
          }}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center" style={{ marginBottom: "32px" }}>
            <h1 className="text-[28px] font-bold tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>Profile</h1>
            <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>Your profile information</p>
          </motion.div>

          {/* Avatar Upload */}
          <motion.div variants={itemVariants} className="flex flex-col items-center gap-4" style={{ marginBottom: "40px" }}>
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
                style={{ border: "4px solid var(--border-color)", boxShadow: "var(--shadow-md)" }}
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0
                  w-10 h-10 rounded-full flex items-center justify-center text-white
                  cursor-pointer transition-transform hover:scale-110 shadow-lg
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
                style={{ 
                  background: "var(--sent-bubble)",
                  boxShadow: "var(--shadow-glow-strong), inset 0 2px 0 rgba(255,255,255,0.2)",
                  border: "2px solid var(--bg-primary)"
                }}
              >
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-[13px] font-medium" style={{ color: "var(--text-muted)" }}>
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </motion.div>

          {/* User Info Fields */}
          <motion.div variants={itemVariants} style={{ marginBottom: "40px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label className="text-[13px] font-medium uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                <User className="w-4 h-4" />
                Full Name
              </label>
              <div
                className="w-full flex items-center"
                style={{
                  height: "56px",
                  padding: "0 20px",
                  borderRadius: "16px",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                  fontSize: "15px"
                }}
              >
                {authUser?.fullName}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label className="text-[13px] font-medium uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div
                className="w-full flex items-center"
                style={{
                  height: "56px",
                  padding: "0 20px",
                  borderRadius: "16px",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                  fontSize: "15px"
                }}
              >
                {authUser?.email}
              </div>
            </div>
          </motion.div>

          {/* Account Information */}
          <motion.div variants={itemVariants}>
            <h2 className="text-[18px] font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Account Information
            </h2>
            <div
              className="rounded-[16px] overflow-hidden text-[14px]"
              style={{
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="flex items-center justify-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ color: "var(--text-secondary)" }}>Member Since</span>
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{authUser?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between" style={{ padding: "16px 20px" }}>
                <span style={{ color: "var(--text-secondary)" }}>Account Status</span>
                <span className="font-semibold flex items-center gap-2" style={{ color: "var(--accent-primary)" }}>
                  <span className="w-2 h-2 rounded-full shadow-[0_0_8px_var(--accent-glow-strong)]" style={{ backgroundColor: "var(--accent-primary)" }}></span>
                  Active
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
