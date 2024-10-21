"use client";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

export default function Home() {
  const [enlargedImage, setEnlargedImage] = useState(null);

  const handleImageClick = (image) => {
    setEnlargedImage(image === enlargedImage ? null : image);
  };

  const images = [
    { src: "/babycena.jpeg", alt: "Baby Cena" },
    { src: "/Charl.jpeg", alt: "Charl" },
    { src: "/WeddingFam.jpeg", alt: "Wedding Family" },
    { src: "/me.jpeg", alt: "Me" },
  ];

  return (
    <>
      <Head>
        <title>Welcome to My Neurosparkly World</title>
        <meta
          name="description"
          content="A vibrant space where you can explore photos and experiences that reflect different aspects of my world."
        />
        <meta
          name="keywords"
          content="neurosparkly, personal, photos, creative space"
        />
        <meta name="author" content="Nicky Mortoza-Cowles" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-400 via-pink-300 to-blue-400 text-white">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to a Part of my World
          </h1>
          <p className="text-lg">
            This is a Neurosparkly space, will you join me?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-8">
          {images.map((image) => (
            <div
              key={image.src}
              className={`relative cursor-pointer ${
                enlargedImage === image.src ? "scale-150" : "scale-100"
              } transition-transform duration-300`}
              onClick={() => handleImageClick(image.src)}
            >
              <div className="w-40 h-40 overflow-hidden hexagon relative">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill // Use fill to fill the parent container
                  className="object-cover" // Ensures the image covers the hexagon
                />
              </div>
            </div>
          ))}
        </div>

        {enlargedImage && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
            onClick={() => setEnlargedImage(null)}
          >
            <div className="relative">
              <Image
                src={enlargedImage}
                alt="Enlarged view"
                width={500}
                height={500}
              />
            </div>
          </div>
        )}

        <style jsx>{`
          .hexagon {
            clip-path: polygon(
              25% 6.7%,
              75% 6.7%,
              100% 50%,
              75% 93.3%,
              25% 93.3%,
              0% 50%
            );
          }

          .hexagon-image {
            transition: transform 0.3s ease-in-out;
          }

          .hexagon-image:hover {
            transform: scale(1.1);
          }
        `}</style>
      </div>
    </>
  );
}
