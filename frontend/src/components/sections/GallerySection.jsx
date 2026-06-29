import SectionHeader from "../common/SectionHeader";

const albums = [
  {
    title: "Training Albums",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d",
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2",
    ],
  },
  {
    title: "Community Events",
    images: [
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
    ],
  },
];

function GallerySection() {
  return (
    <section className="container py-5">
      <SectionHeader
        title="Gallery"
        subtitle="Albums and highlights from our programs and community work"
      />

      <div className="gallery-album-list">
        {albums.map((album) => (
          <div className="gallery-album" key={album.title}>
            <h3 className="mb-3">{album.title}</h3>
            <div className="gallery-marquee-wrapper">
              <div className="gallery-marquee-track">
                {[...album.images, ...album.images].map((src, idx) => (
                  <div className="gallery-album-item" key={`${album.title}-${idx}`}>
                    <div className="bg-white shadow-sm overflow-hidden" style={{ borderRadius: 20 }}>
                      <img
                        src={`${src}?auto=format&fit=crop&w=900&q=70`}
                        alt={`${album.title} ${idx + 1}`}
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
    </section>
  );
}

export default GallerySection;
