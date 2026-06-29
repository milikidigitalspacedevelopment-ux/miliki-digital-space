import { useEffect, useState } from "react";
import StoryCard from "../cards/StoryCard";
import blogService from "../../services/blogService";

function StoriesSection() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const response =
        await blogService.listBlogs({ featured: true });

      setStories(response.data || response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="py-5 bg-light">

      <div className="container">

        <h2 className="fw-bold mb-4">
          Success Stories
        </h2>

        <div className="row">

          {stories.slice(0, 3).map((story) => (
            <div
              key={story.id}
              className="col-lg-4 mb-4"
            >
              <StoryCard story={story} />
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default StoriesSection;