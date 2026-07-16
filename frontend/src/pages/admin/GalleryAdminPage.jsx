import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Trash2, UploadCloud, ArrowLeft } from "lucide-react";
import galleryService from "../../services/galleryService";
import uploadService from "../../services/uploadService";

function GalleryAdminPage() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [album, setAlbum] = useState("Community");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadImages(); 
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await galleryService.listImages();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load gallery images.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");
      const formData = new FormData();
      formData.append("image", file);
      const response = await uploadService.uploadImage(formData);
      const uploadedUrl = response?.url || response?.secure_url || response?.data?.url || "";
      if (!uploadedUrl) throw new Error("Upload failed");
      setImageUrl(uploadedUrl);
    } catch (err) {
      console.error(err);
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      setError("Please provide a title and an image.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await galleryService.createImage({
        title: title.trim(),
        description: description.trim(),
        image_url: imageUrl.trim(),
        album: album.trim(),
      });
      setTitle("");
      setDescription("");
      setImageUrl("");
      setAlbum("Community");
      await loadImages();
    } catch (err) {
      console.error(err);
      setError("Unable to save the gallery image.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this gallery image?")) return;
    try {
      await galleryService.deleteImage(id);
      setImages((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError("Unable to delete the gallery image.");
    }
  };

  const groupedImages = useMemo(() => {
    return images.reduce((acc, image) => {
      const key = image.album || "General";
      if (!acc[key]) acc[key] = [];
      acc[key].push(image);
      return acc;
    }, {});
  }, [images]);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Gallery images</h2>
          <p className="text-muted mb-0">Upload new gallery content and manage the images shown on the public gallery.</p>
        </div>
        <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={() => navigate("/admin")}> 
          <ArrowLeft size={16} className="me-1" />
          Back to dashboard
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Add image</h5>
              <form onSubmit={handleSubmit} className="d-grid gap-3">
                <div>
                  <label className="form-label">Title</label>
                  <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Community training" />
                </div>
                <div>
                  <label className="form-label">Album</label>
                  <input className="form-control" value={album} onChange={(e) => setAlbum(e.target.value)} placeholder="Community" />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description for the image" />
                </div>
                <div>
                  <label className="form-label">Image URL</label>
                  <input className="form-control" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
                </div>

                <label className="btn btn-outline-primary rounded-pill w-100">
                  <UploadCloud size={16} className="me-2" />
                  {uploading ? "Uploading..." : "Upload from device"}
                  <input type="file" accept="image/*" className="d-none" onChange={handleFileUpload} />
                </label>

                <button type="submit" className="btn btn-success rounded-pill" disabled={saving || uploading}>
                  <ImagePlus size={16} className="me-2" />
                  {saving ? "Saving..." : "Save image"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-xl-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Current gallery images</h5>
              {loading ? (
                <div className="text-muted">Loading gallery images...</div>
              ) : images.length === 0 ? (
                <div className="text-muted">No gallery images yet.</div>
              ) : (
                Object.entries(groupedImages).map(([albumName, albumImages]) => (
                  <div key={albumName} className="mb-4">
                    <h6 className="fw-semibold text-capitalize mb-3">{albumName}</h6>
                    <div className="row g-3">
                      {albumImages.map((image) => (
                        <div className="col-md-6" key={image.id}>
                          <div className="border rounded-4 overflow-hidden h-100">
                            <img src={image.image_url} alt={image.title} className="w-100" style={{ height: 180, objectFit: "cover" }} />
                            <div className="p-3">
                              <div className="d-flex justify-content-between align-items-start gap-2">
                                <div>
                                  <h6 className="fw-semibold mb-1">{image.title}</h6>
                                  <p className="text-muted small mb-0">{image.description || "No description provided."}</p>
                                </div>
                                <button type="button" className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => handleDelete(image.id)}>
                                  <Trash2 size={14} className="me-1" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GalleryAdminPage;
