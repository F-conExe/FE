import React, { useState, useEffect } from "react";
import axios from "axios";
import BreadCrumb from "../../../components/user/BreadCrumb/BreadCrumb";
import FilterSide from "../../../components/user/FilterSide/FilterSide";
import ProjectCardView from "../../../components/user/ProjectCardView/ProjectCardView";
import "./Project.css";

const Project = () => {
  const [projects, setProjects] = useState([]); // All projects
  const [filteredProjects, setFilteredProjects] = useState([]); // Filtered projects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;
  // Fetch data from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://103.179.184.83:7979/apiPost/getAllPosts"); // Replace with your actual API endpoint
        if (response.data.success) {
          const filteredByType = response.data.data.filter(
            (project) => project.postTypeId === 1
          );
      
          // Adding random locations for each project for filtering
          const locations = ["Hà Nội", "Đà Nẵng", "Hồ Chí Minh", "Hải Phòng", "Japan", "Thủ Đức", "Hòa Lạc"];
      
          const projectsWithLocations = filteredByType.map((project, index) => ({
            ...project,
            // Assign a location by cycling through the locations array
            position: locations[index % locations.length],
          }));
      
          setProjects(projectsWithLocations);
          setFilteredProjects(projectsWithLocations); // Initially, all projects with postTypeId = 1 are displayed
        } else {
          setError("Failed to load projects.");
        }
      } catch (err) {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
      
    };
    fetchProjects();
  }, []);

  const handleFilterChange = (selectedFilters) => {
    let newFilteredProjects = [...projects];

    // Filter by locations
    if (selectedFilters.locations.length > 0) {
      newFilteredProjects = newFilteredProjects.filter((project) =>
        selectedFilters.locations.includes(project.position)
      );
    }

    // Filter by skills
    if (selectedFilters.skills.length > 0) {
      newFilteredProjects = newFilteredProjects.filter((project) =>
        selectedFilters.skills.some((skill) => project.skills.includes(skill))
      );
    }

    // Filter by categories
    if (selectedFilters.categories.length > 0) {
      newFilteredProjects = newFilteredProjects.filter((project) =>
        selectedFilters.categories.includes(project.title)
      );
    }

    setFilteredProjects(newFilteredProjects);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="Project">
      {/* Bread crumb and current router */}
      <div className="section-bread-crumb">
        <div className="container">
          <BreadCrumb title="Project Grid" page="Project" />
        </div>
      </div>

      <div className="section-dev-list">
        <div className="container">
          <div className="main-flex">
            {/* Filter sidebar */}
            <div className="filter-side">
              <FilterSide onFilterChange={handleFilterChange} />
            </div>

            <div className="dev-list">
              {/* Filter-top */}
              <div className="dev-list-filter">
                <span>Found {filteredProjects.length} Results</span>
              </div>

              {/* List-render */}
              <div className="project-list">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <ProjectCardView
                      key={project.postId}
                      infomation={{
                        id: project.postId,
                        name: project.title,
                        position:  project.position,
                        tags: project.skills.split(", "),
                        salary: `$${project.budgetOrSalary}`,
                        avatar: project.imgUrl,
                      }}
                    />
                  ))
                ) : (
                  <p>No projects found based on your filters.</p>
                )}
              </div>

              {/* Pagination can be handled here */}
              <div className="dev-list-navigator">
                <div className="arrow arrow-left">
                  <i className="bi bi-chevron-left"></i>
                </div>
                <div className="number-page page-actived">1</div>
                <div className="number-page">2</div>
                <div className="number-page">3</div>
                <div className="number-page dot-summary">...</div>
                <div className="number-page">20</div>
                <div className="arrow arrow-right">
                  <i className="bi bi-chevron-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;

