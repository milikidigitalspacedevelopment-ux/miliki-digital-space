import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FileText,
  Sparkles,
  Heading1,
  Quote,
  List,
  Type,
  Image as ImageIcon,
  Minus,
  Clock3,
  Save,
  Upload,
  Play,
  Eye,
  ArrowLeft,
} from "lucide-react";
import blogService from "../../services/blogService";
import uploadService from "../../services/uploadService";

const emptyBlog = {
  id: null,
  title: "",
  category: "",
  status: "draft",
  featured: false,
  featured_image: "",
  excerpt: "",
  content: "",
  author: "",
  published_at: "",
  slug: "",
  seo_title: "",
  meta_description: "",
};

const draftStorageKey = "miliki-blog-draft";

function BlogEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [selectedBlog, setSelectedBlog] = useState(emptyBlog);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editorView, setEditorView] = useState("write");
  const [lastSavedLabel, setLastSavedLabel] = useState("Ready to edit");
  const [imageBlock, setImageBlock] = useState({ src: "", alt: "", caption: "" });
  const [videoUrl, setVideoUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      if (!id) {
        const savedDraft = localStorage.getItem(draftStorageKey);
        if (savedDraft) {
          try {
            const parsed = JSON.parse(savedDraft);
            setSelectedBlog({ ...emptyBlog, ...parsed, id: null });
            setLastSavedLabel("Draft ready");
          } catch {
            setSelectedBlog(emptyBlog);
          }
        } else {
          setSelectedBlog(emptyBlog);
        }
        setLoading(false);
        return;
      }

      try {
        const blog = await blogService.getBlog(id);
        setSelectedBlog({
          ...emptyBlog,
          ...blog,
          category: blog.category || blog.category_name || "",
          author: blog.author || blog.author_name || "",
          published_at: blog.published_at || blog.date || "",
          excerpt: blog.excerpt || "",
          seo_title: blog.seo_title || "",
          meta_description: blog.meta_description || "",
        });
        setImageBlock({ src: blog.featured_image || "", alt: "", caption: "" });
        setLastSavedLabel("Ready to edit");
      } catch (err) {
        console.error(err);
        setError("Unable to load the blog article.");
      } finally {
        setLoading(false);
      }
    };

    void loadBlog();
  }, [id]);

  useEffect(() => {
    if (id) return;

    const hasDraftContent =
      selectedBlog.title ||
      selectedBlog.content ||
      selectedBlog.excerpt ||
      selectedBlog.slug ||
      selectedBlog.category ||
      selectedBlog.author ||
      selectedBlog.featured_image ||
      selectedBlog.seo_title ||
      selectedBlog.meta_description;

    if (!hasDraftContent) return;

    const timer = window.setTimeout(() => {
      localStorage.setItem(draftStorageKey, JSON.stringify(selectedBlog));
      setLastSavedLabel("Auto-saved");
    }, 500);

    return () => window.clearTimeout(timer);
  }, [id, selectedBlog]);

  const handleFieldChange = (field, value) => {
    setSelectedBlog((prev) => ({ ...prev, [field]: value }));
    setLastSavedLabel("Autosaving...");
  };

  const insertAtCursor = (markup) => {
    const textarea = editorRef.current;
    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = selectedBlog.content.slice(start, end) || "Write something here...";
    const nextContent = `${selectedBlog.content.slice(0, start)}${markup.replace("__selection__", selectedText)}${selectedBlog.content.slice(end)}`;

    handleFieldChange("content", nextContent);

    window.requestAnimationFrame(() => {
      textarea.focus();
      const cursorPos = start + markup.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const wrapSelection = (prefix, suffix = prefix) => {
    const textarea = editorRef.current;
    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = selectedBlog.content.slice(start, end) || "Highlight text";
    const wrappedValue = `${prefix}${selectedText}${suffix}`;
    const nextContent = `${selectedBlog.content.slice(0, start)}${wrappedValue}${selectedBlog.content.slice(end)}`;

    handleFieldChange("content", nextContent);

    window.requestAnimationFrame(() => {
      const cursorStart = start + prefix.length;
      const cursorEnd = cursorStart + selectedText.length;
      textarea.focus();
      textarea.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const insertImageBlock = (srcOverride, altOverride, captionOverride) => {
    const src = srcOverride || imageBlock.src || selectedBlog.featured_image || "/impact.png";
    const alt = altOverride ?? imageBlock.alt ?? "";
    const caption = captionOverride ?? imageBlock.caption ?? "";
    const markup = `<figure class="my-3"><img src="${src}" alt="${alt}" class="img-fluid rounded-4" style="max-width:100%;height:auto;" loading="lazy" /><figcaption class="text-muted small mt-2">${caption}</figcaption></figure>\n`;

    insertAtCursor(markup);
  };

  const handleInsertImage = () => {
    insertImageBlock();
  };

  const handleImageFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setLastSavedLabel("Please choose an image file");
      return;
    }

    try {
      setUploadingImage(true);
      setLastSavedLabel("Uploading image to Cloudinary...");

      const formData = new FormData();
      formData.append("image", file);

      const response = await uploadService.uploadImage(formData);
      const uploadedUrl = response?.url || response?.secure_url || response?.data?.url || "";

      if (!uploadedUrl) {
        throw new Error("Image upload did not return a URL");
      }

      setImageBlock((prev) => ({ ...prev, src: uploadedUrl }));
      setSelectedBlog((prev) => ({ ...prev, featured_image: uploadedUrl }));
      insertImageBlock(uploadedUrl);
      setLastSavedLabel("Image uploaded and inserted");
    } catch (err) {
      console.error(err);
      setLastSavedLabel("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      void handleImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    if (e.dataTransfer?.types?.includes("Files")) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = "copy";
      setDragActive(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleVideoInsert = () => {
    const trimmedUrl = videoUrl.trim();
    if (!trimmedUrl) {
      setLastSavedLabel("Add a video URL first");
      return;
    }

    const youtubeMatch = trimmedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/i);
    const embedUrl = youtubeMatch ? `https://www.youtube.com/embed/${youtubeMatch[1]}` : trimmedUrl;
    const markup = `<div class="ratio ratio-16x9 my-3"><iframe src="${embedUrl}" title="Embedded video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>\n`;

    insertAtCursor(markup);
    setVideoUrl("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const payload = {
        title: selectedBlog.title,
        content: selectedBlog.content,
        excerpt: selectedBlog.excerpt,
        seo_title: selectedBlog.seo_title,
        meta_description: selectedBlog.meta_description,
        category_name: selectedBlog.category,
        author_name: selectedBlog.author,
        status: selectedBlog.status,
        featured_image: selectedBlog.featured_image,
        published_at: selectedBlog.status === "published" ? selectedBlog.published_at || new Date().toISOString() : null,
        slug: selectedBlog.slug || undefined,
        featured: Boolean(selectedBlog.featured),
      };

      if (id) {
        await blogService.updateBlog(id, payload);
      } else {
        await blogService.createBlog(payload);
        localStorage.removeItem(draftStorageKey);
      }

      navigate("/admin/blogs");
    } catch (err) {
      console.error(err);
      setError("Unable to save article. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const wordCount = useMemo(() => {
    const textContent = String(selectedBlog.content || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return textContent ? textContent.split(" ").length : 0;
  }, [selectedBlog.content]);

  const readingTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 180)), [wordCount]);

  const previewMarkup = useMemo(() => {
    const base = String(selectedBlog.content || "").trim();
    if (!base) {
      return "<p class='text-muted'>Your article preview will appear here as you write.</p>";
    }
    return base.startsWith("<") ? base : `<p>${base.replace(/\n/g, "<br />")}</p>`;
  }, [selectedBlog.content]);

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-info">Loading article...</div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">{id ? "Edit Article" : "Create Article"}</h2>
          <p className="text-muted mb-0">Write with rich formatting, auto-save drafts, and live preview.</p>
        </div>

        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={() => navigate("/admin/blogs")}
          >
            <ArrowLeft size={16} className="me-1" />
            Back to articles
          </button>
          <button type="submit" form="blog-editor-form" className="btn btn-primary rounded-pill" disabled={isSaving}>
            <Save size={16} className="me-1" />
            {isSaving ? "Saving..." : id ? "Update Article" : "Create Article"}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form id="blog-editor-form" onSubmit={handleSave}>
        <div className="row g-4">
          <div className="col-xl-8">
            <div className="card border-0 shadow-sm rounded-5">
              <div className="card-body">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <button type="button" className={`btn btn-sm rounded-pill ${editorView === "write" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setEditorView("write")}> 
                    <Type size={15} className="me-1" />
                    Write
                  </button>
                  <button type="button" className={`btn btn-sm rounded-pill ${editorView === "preview" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setEditorView("preview")}> 
                    <Eye size={15} className="me-1" />
                    Preview
                  </button>
                </div>

                <div className="d-flex align-items-center gap-3 text-muted small mb-4">
                  <Clock3 size={15} />
                  <span>{wordCount} words • {readingTime} min read</span>
                  <span className="text-success">• {lastSavedLabel}</span>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-4">
                  <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => wrapSelection("<strong>", "</strong>")}
                  >
                    <Type size={14} className="me-1" />
                    Bold
                  </button>
                  <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => wrapSelection("<em>", "</em>")}
                  >
                    <Type size={14} className="me-1" />
                    Italic
                  </button>
                  <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => wrapSelection("<h2>", "</h2>")}
                  >
                    <Heading1 size={14} className="me-1" />
                    Heading
                  </button>
                  <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => insertAtCursor("<blockquote>__selection__</blockquote>\n")}
                  >
                    <Quote size={14} className="me-1" />
                    Quote
                  </button>
                  <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => insertAtCursor("<ul><li>Item</li></ul>\n")}
                  >
                    <List size={14} className="me-1" />
                    List
                  </button>
                  <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill" onClick={handleInsertImage}
                  >
                    <ImageIcon size={14} className="me-1" />
                    Image Block
                  </button>
                  <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => insertAtCursor("<hr />\n")}
                  >
                    <Minus size={14} className="me-1" />
                    Divider
                  </button>
                </div>

                {editorView === "write" ? (
                  <>
                    <label className="form-label fw-semibold">Article content</label>
                    <textarea
                      ref={editorRef}
                      className="form-control"
                      rows={16}
                      value={selectedBlog.content}
                      onChange={(e) => handleFieldChange("content", e.target.value)}
                      placeholder="Start writing your article here..."
                      required
                    />
                  </>
                ) : (
                  <div className="border rounded-4 p-3 bg-light-subtle" dangerouslySetInnerHTML={{ __html: previewMarkup }} />
                )}
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="card border-0 shadow-sm rounded-4 mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <Sparkles size={18} className="me-2 text-primary" />
                  <h6 className="mb-0 fw-bold">Content blocks</h6>
                </div>

                <div className="row g-2">
                  <div className="col-6">
                    <button type="button" className="btn btn-outline-primary w-100 btn-sm" onClick={() => document.getElementById("blog-file-input")?.click()}>
                      <ImageIcon size={14} className="me-1" />
                      Add image
                    </button>
                  </div>
                  <div className="col-6">
                    <button type="button" className="btn btn-outline-success w-100 btn-sm" onClick={handleVideoInsert}>
                      <Play size={14} className="me-1" />
                      Add video
                    </button>
                  </div>
                  <div className="col-6">
                    <button type="button" className="btn btn-outline-secondary w-100 btn-sm" onClick={() => insertAtCursor("<h2>New Section</h2>\n")}
                    >
                      <Heading1 size={14} className="me-1" />
                      Add heading
                    </button>
                  </div>
                  <div className="col-6">
                    <button type="button" className="btn btn-outline-secondary w-100 btn-sm" onClick={() => insertAtCursor("<blockquote>Write a quote here...</blockquote>\n")}
                    >
                      <Quote size={14} className="me-1" />
                      Add quote
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <Sparkles size={18} className="me-2 text-primary" />
                  <h6 className="mb-0 fw-bold">Story settings</h6>
                </div>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={selectedBlog.title} onChange={(e) => handleFieldChange("title", e.target.value)} required />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Slug</label>
                    <input type="text" className="form-control" value={selectedBlog.slug} onChange={(e) => handleFieldChange("slug", e.target.value)} placeholder="article-slug" />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Category</label>
                    <input type="text" className="form-control" value={selectedBlog.category} onChange={(e) => handleFieldChange("category", e.target.value)} placeholder="Category name" />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Author</label>
                    <input type="text" className="form-control" value={selectedBlog.author} onChange={(e) => handleFieldChange("author", e.target.value)} placeholder="Author name" />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={selectedBlog.status} onChange={(e) => handleFieldChange("status", e.target.value)}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Published Date</label>
                    <input type="date" className="form-control" value={selectedBlog.published_at?.slice(0, 10) || ""} onChange={(e) => handleFieldChange("published_at", e.target.value)} />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Featured image URL</label>
                    <input type="text" className="form-control" value={selectedBlog.featured_image} onChange={(e) => handleFieldChange("featured_image", e.target.value)} placeholder="https://..." />
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-3">
              <div className="card-body">
                <h6 className="fw-bold mb-3">Media</h6>
                <div className="row g-3">
                  <div className="col-12">
                    <div
                      className={`border border-2 rounded-4 p-3 text-center ${dragActive ? "border-primary bg-light" : "border-dashed"}`}
                      onDragEnter={handleDragOver}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Upload size={18} className="me-2" />
                      {uploadingImage ? "Uploading image to Cloudinary..." : "Drag and drop an image here"}
                    </div>
                  </div>

                  <div className="col-12">
                    <button type="button" className="btn btn-outline-primary w-100" onClick={() => document.getElementById("blog-file-input")?.click()} disabled={uploadingImage}>
                      {uploadingImage ? "Uploading..." : "Choose image from device"}
                    </button>
                    <input
                      id="blog-file-input"
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={(e) => handleImageFile(e.target.files?.[0])}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={imageBlock.src}
                      onChange={(e) => setImageBlock((prev) => ({ ...prev, src: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Alt text</label>
                    <input
                      type="text"
                      className="form-control"
                      value={imageBlock.alt}
                      onChange={(e) => setImageBlock((prev) => ({ ...prev, alt: e.target.value }))}
                      placeholder="Describe the image"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Caption</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={imageBlock.caption}
                      onChange={(e) => setImageBlock((prev) => ({ ...prev, caption: e.target.value }))}
                      placeholder="Short caption under the image"
                    />
                  </div>

                  <div className="col-12">
                    <button type="button" className="btn btn-outline-primary w-100" onClick={handleInsertImage}>
                      Insert image block
                    </button>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Video URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="YouTube or MP4 URL"
                    />
                  </div>

                  <div className="col-12">
                    <button type="button" className="btn btn-outline-success w-100" onClick={handleVideoInsert}>
                      <Play size={15} className="me-2" />
                      Insert video
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <h6 className="fw-bold mb-3">SEO & summary</h6>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">SEO title</label>
                    <input type="text" className="form-control" value={selectedBlog.seo_title} onChange={(e) => handleFieldChange("seo_title", e.target.value)} placeholder="Short search-friendly title" />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Meta description</label>
                    <textarea className="form-control" rows={3} value={selectedBlog.meta_description} onChange={(e) => handleFieldChange("meta_description", e.target.value)} placeholder="Short description for search engines" />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Excerpt</label>
                    <textarea className="form-control" rows={3} value={selectedBlog.excerpt} onChange={(e) => handleFieldChange("excerpt", e.target.value)} placeholder="A compact summary of the article" />
                  </div>

                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" checked={!!selectedBlog.featured} onChange={(e) => handleFieldChange("featured", e.target.checked)} id="featuredSwitch" />
                      <label className="form-check-label" htmlFor="featuredSwitch">Mark as featured</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default BlogEditorPage;
