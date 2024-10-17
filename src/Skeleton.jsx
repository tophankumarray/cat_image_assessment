import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./Loading";

const Skeleton = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.thecatapi.com/v1/images/search?limit=5&page=${10}&order=Desc`
      );
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setImages((prevImages) => [...prevImages, ...response.data]);
      }
    } catch (err) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(page);
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading ||
      !hasMore
    ) {
      return;
    }
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setImages([]);
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Cat Image</h1>

        {error && <p className="text-red-500">{error}</p>}
        {!loading && images.length === 0 && <p>No images available.</p>}

        <div className="grid grid-cols-1 gap-4">
          {images.map((image, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded shadow-md">
              <img
                src={image.url}
                alt="Cat"
                className="w-full h-72 bg-slate-400 rounded"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between my-4">
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            className="bg-indigo-800 text-white px-4 py-2 rounded disabled:bg-gray-400"
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
        {loading && (
          <p>
            <Loading />
          </p>
        )}
      </div>
    </div>
  );
};

export default Skeleton;
