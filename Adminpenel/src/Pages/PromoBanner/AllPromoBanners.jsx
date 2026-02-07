import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const AllPromoBanners = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const res = await axios.get(
      "https://api.ssdipl.com/api/get-promo-banners"
    );
    setBanners(res.data.data || []);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete banner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    await axios.delete(
      `https://api.ssdipl.com/api/delete-promo-banner/${id}`
    );

    setBanners((prev) => prev.filter((b) => b._id !== id));
    Swal.fire("Deleted!", "Banner removed", "success");
  };

  return (
    <>
      <div className="bread">
        <div className="head">
          <h4>Promo Banners</h4>
        </div>
        <div className="links">
          <Link to="/add-promo-banners" className="add-new">
            Add Banner
          </Link>
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Status</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b, i) => (
              <tr key={b._id}>
                <td>{i + 1}</td>
                <td>
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${b.image}`}
                    alt=""
                    style={{ width: 120, borderRadius: 8 }}
                  />
                </td>
                <td>{b.title || "—"}</td>
                <td>{b.isActive ? "Active" : "Inactive"}</td>
                <td>
                  <button
                    className="bt delete"
                    onClick={() => handleDelete(b._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllPromoBanners;
