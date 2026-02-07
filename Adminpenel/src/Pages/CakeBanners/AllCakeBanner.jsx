import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AllCakeBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH BANNERS ================= */
  useEffect(() => {
    fetchCakeBanners();
  }, []);

  const fetchCakeBanners = async () => {
    try {
      const res = await axios.get(
        "https://api.ssdipl.com/api/get-cake-banners"
      );
      setBanners(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch cake banners", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Cake Banner?",
      text: "This banner will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(
        `https://api.ssdipl.com/api/delete-cake-banner/${id}`
      );

      setBanners((prev) => prev.filter((b) => b._id !== id));

      Swal.fire("Deleted!", "Cake banner removed.", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to delete cake banner", "error");
      console.error(error);
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading cake banners...</p>;
  }

  return (
    <>
      <div className="bread">
        <div className="head">
          <h4>All Cake Banners</h4>
        </div>
        <div className="links">
          <Link to="/add-cake-banner" className="add-new">
            Add Cake Banner
          </Link>
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Banner Slot</th>
              <th>Preview</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {banners.length > 0 ? (
              banners.map((banner, index) => (
                <tr key={banner._id}>
                  <td>{index + 1}</td>

                  <td className="text-capitalize">
                    {banner.bannerKey === "cakeBanner1"
                      ? "Cake Banner 1"
                      : "Cake Banner 2"}
                  </td>

                  <td>
                    <img
                      src={`${process.env.REACT_APP_API_URL}/${banner.image}`}
                      alt="Cake Banner"
                      style={{
                        width: "220px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </td>

                  <td>
                    <Link
                      to={`/edit-cake-banner/${banner._id}`}
                      className="bt edit"
                    >
                      Edit
                    </Link>
                  </td>

                  <td>
                    <button
                      className="bt delete"
                      onClick={() => handleDelete(banner._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No cake banners found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllCakeBanners;
