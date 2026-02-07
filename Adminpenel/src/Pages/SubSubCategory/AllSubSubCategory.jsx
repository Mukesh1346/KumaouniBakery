import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllSubSubCategory = () => {
  const [subSubcategories, setSubSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ================= FETCH SUB-SUBCATEGORIES ================= */
  useEffect(() => {
    const fetchSubSubcategories = async () => {
      try {
        const res = await axios.get(
          "https://api.ssdipl.com/api/get-subsubcategory"
        );
        setSubSubcategories(res.data?.data || []);
      } catch (error) {
        toast.error("Error fetching sub-subcategories");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubSubcategories();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This sub-subcategory will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(
        `https://api.ssdipl.com/api/delete-subsubcategory/${id}`
      );

      setSubSubcategories((prev) =>
        prev.filter((item) => item._id !== id)
      );

      Swal.fire("Deleted!", "Sub-Subcategory deleted.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to delete sub-subcategory.", "error");
      console.error(error);
    }
  };

  if (isLoading) {
    return <p className="text-center mt-5">Loading sub-subcategories...</p>;
  }

  return (
    <>
      <ToastContainer />

      <div className="bread">
        <div className="head">
          <h4>All Sub-Subcategory List</h4>
        </div>
        <div className="links">
          <Link to="/add-sub-subcategory" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Main Category</th>
              <th>Sub Category</th>
              <th>Sub-Subcategory</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {subSubcategories.length > 0 ? (
              subSubcategories.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>

                  <td>{item?.mainCategoryId?.mainCategoryName || "—"}</td>

                  <td>{item?.subCategoryId?.subCategoryName || "—"}</td>

                  <td>{item.subSubcategoryName}</td>

                  <td>
                    <Link
                      to={`/edit-sub-subcategory/${item._id}`}
                      className="bt edit"
                    >
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>

                  <td>
                    <button
                      className="bt delete"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No sub-subcategories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllSubSubCategory;
