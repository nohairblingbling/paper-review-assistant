import React from "react";
import { motion } from "framer-motion";

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

import { FaPaperPlane, FaMagic, FaRocket } from "react-icons/fa";

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

export default function HomePage({ setCurrentPage }: HomePageProps) {
  return (
    <div className="hero min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <motion.h1
            className="text-6xl font-bold mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Paper Review Assistant{" "}
            <FaPaperPlane className="inline-block ml-2" />
          </motion.h1>
          <motion.p
            className="text-xl mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            This is a user-friendly paper review assistant based on Your API.
            Quickly and accurately review your academic papers!{" "}
            <FaMagic className="inline-block ml-2" />
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
              className="btn btn-primary btn-lg text-xl px-8 py-3"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 8px rgb(255,255,255)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage("review")}
            >
              Start Review <FaRocket className="inline-block ml-2" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
