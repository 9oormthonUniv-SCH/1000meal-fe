import { FaGithub, FaInstagram } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="text-xs text-gray-400 px-4 py-3 text-center border-t border-gray-100">
      {/* 소셜 아이콘 */}
      <div className="mt-2 flex justify-center gap-4 text-lg text-gray-600">
        <a
          href="mailto:9oormthon.univ.sch@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-500 transition-colors"
        >
          <SiGmail size={20} />
        </a>
        <a
          href="https://instagram.com/goormthon_univ_schu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-500 transition-colors"
        >
          <FaInstagram size={20} />
        </a>
        <a
          href="https://github.com/9oormthonUniv-SCH"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 transition-colors"
        >
          <FaGithub size={20} />
        </a>
      </div>

      <br />
      Copyright © 2025 오늘 순밥
      <br />
      All Rights Reserved.
    </footer>
  );
}