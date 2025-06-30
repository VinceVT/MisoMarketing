import React, { useState, useEffect, useMemo } from "react";
import { projects } from "../data/projects";
import "./PortfolioPage.css"; // We will create this CSS file next

const PortfolioPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleProjects, setVisibleProjects] = useState(12);

  const categories = useMemo(() => {
    const allCategories = projects.map((p) => p.category);
    return ["All", ...new Set(allCategories)];
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(
      (project) =>
        selectedCategory === "All" || project.category === selectedCategory
    );
  }, [selectedCategory]);

  const projectsToShow = useMemo(() => {
    return filteredProjects.slice(0, visibleProjects);
  }, [filteredProjects, visibleProjects]);

  const loadMore = () => {
    setVisibleProjects((prev) => prev + 12);
  };

  // Add and remove 'tab-change' class for animations
  useEffect(() => {
    const cards = document.querySelectorAll(".portfolio-page-project-card");
    cards.forEach((card) => {
      card.classList.remove("tab-change");
      // Trigger reflow to restart animation
      void card.clientWidth;
      card.classList.add("tab-change");
    });
  }, [selectedCategory, projectsToShow]);

  return (
    <div className="portfolio-page-container">
      <header className="portfolio-page-header">
        <h2>Our Work</h2>
        <div className="portfolio-page-filter-tabs">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setVisibleProjects(12); // Reset visible projects on category change
              }}
              className={selectedCategory === category ? "active" : ""}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      <div className="portfolio-page-projects-grid">
        {projectsToShow.map((project, index) => (
          <div
            key={project.id}
            className="portfolio-page-project-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img src={project.image} alt={project.title} />
            <div className="portfolio-page-project-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          </div>
        ))}
      </div>

      {visibleProjects < filteredProjects.length && (
        <div className="portfolio-page-load-more-container">
          <button
            onClick={loadMore}
            className="portfolio-page-load-more-button"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
