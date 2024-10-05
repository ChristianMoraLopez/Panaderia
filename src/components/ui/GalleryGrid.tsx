import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play } from "lucide-react";
import { ContentItem } from "@/types/PortfolioContentFulTypes";

interface GalleryGridProps {
  filteredData: ContentItem[];
  loading: boolean;
  openLightbox: (index: number) => void;
  theme: string;
}

const isVideo = (url: string) => {
  return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
};

const GalleryGrid: React.FC<GalleryGridProps> = ({
  filteredData,
  loading,
  openLightbox,
  theme,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          className={`rounded-full h-32 w-32 border-t-4 border-b-4 ${
            theme === "dark" ? "border-white" : "border-gray-900"
          }`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {filteredData.map((item: ContentItem, index: number) => {
        const url = item.fields?.file?.url ? `https:${item.fields.file.url}` : "";
        const isVideoItem = isVideo(url);
        return (
          <motion.div
            key={index}
            className="relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer h-[70vh] group"
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openLightbox(index)}
          >
            {isVideoItem ? (
              <div className="relative w-full h-full">
                <video
                  src={url}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play size={64} className="text-white opacity-70" />
                </div>
              </div>
            ) : (
              <Image
                src={url}
                alt={item.fields?.description?.toString() || "Image description"}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 group-hover:scale-110"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
            <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
              <p className="text-2xl font-bold mb-2 truncate">
                {typeof item.fields?.title === "string"
                  ? item.fields.title
                  : "Untitled"}
              </p>
              <p className="text-lg truncate">
                {typeof item.fields?.description === "string"
                  ? item.fields.description
                  : "No description"}
              </p>
              {isVideoItem && (
                <span className="inline-block bg-red-600 text-white px-2 py-1 rounded-full text-sm mt-2">
                  Video
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GalleryGrid;