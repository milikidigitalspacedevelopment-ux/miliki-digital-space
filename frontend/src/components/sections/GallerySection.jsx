import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../common/SectionHeader";
import galleryService from "../../services/galleryService";

function GallerySection() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await galleryService.listImages();
        const images = Array.isArray(data) ? data : [];
        const grouped = images.reduce((acc, image) => {
          const albumName = image.album || "General";
          if (!acc[albumName]) acc[albumName] = [];
          acc[albumName].push(image);
          return acc;
        }, {});
        setAlbums(Object.entries(grouped).map(([title, imagesInAlbum]) => ({ title, images: imagesInAlbum })));
      } catch (error) {
        console.error("Failed to load gallery images", error);
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };

    void loadGallery();
  }, []);

  const fallbackAlbums = useMemo(() => [
    {
      title: "Community Highlights",
      images: [
        { image_url: "/images/impact.png", title: "Community highlight" },
      ],
    },
  ], []);

  const visibleAlbums = albums.length > 0 ? albums : fallbackAlbums;

  return (
    <section className="container py-3">
      <SectionHeader
        title="Gallery"
        subtitle="Albums and highlights from our programs and community work"
      />

      {loading ? (
        <div className="text-muted">Loading gallery images...</div>
      ) : (
        <div className="gallery-album-list">
          {visibleAlbums.map((album) => (
            <div className="gallery-album" key={album.title}>
              <h3 className="mb-3">{album.title}</h3>
              <div className="gallery-marquee-wrapper">
                <div className="gallery-marquee-track">
                  {[...album.images, ...album.images].map((item, idx) => (
                    <div className="gallery-album-item" key={`${album.title}-${idx}`}>
                      <div className="bg-white shadow-sm overflow-hidden" style={{ borderRadius: 20 }}>
                        <img
                          src={item.image_url || "/images/impact.png"}
                          alt={item.title || `${album.title} ${idx + 1}`}
                          className="w-100"
                          style={{ height: 260, objectFit: "cover" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default GallerySection;
