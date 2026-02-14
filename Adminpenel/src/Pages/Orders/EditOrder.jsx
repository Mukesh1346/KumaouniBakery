import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditOrder = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState({});
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatusMassage, setOrderStatusMassage] = useState("");
  const navigate = useNavigate();

  // Fetch API data
  const getApiData = async () => {
    try {
      const res = await axios.get(`https://api.ssdipl.com/api/checkout/${id}`);
      setOrderData(res.data);
      setOrderStatus(res.data.orderStatus);
      setPaymentStatus(res.data.paymentStatus);
    } catch (error) {
      console.error("Error fetching order data:", error);
      toast.error("Failed to fetch order data.");
    }
  };

  useEffect(() => {
    getApiData();
  }, []);

  // Update Order Status and Payment Status
  const handleUpdate = async () => {
    try {
      const updatedData = {
        orderStatus,
        paymentStatus,
        date: new Date(),
        orderStatusMassage
      };
      const res = await axios.put(
        `https://api.ssdipl.com/api/checkout/${id}`,
        updatedData
      );
      toast.success("Order updated successfully!");
      setOrderData(res.data); // Optionally refresh the data
      navigate("/all-orders");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order.");
    }
  };

  const handlePrint = (note) => {
  const printWindow = window.open("", "_blank");

  printWindow.document.write(`
    <html>
      <head>
        <title>Special Greeting Card</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            text-align: center;
            background: #f8f8f8;
          }

          .card {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            max-width: 500px;
            margin: auto;
            border: 2px solid #ffc107;
          }

          h2 {
            margin-bottom: 20px;
            color: #ff6a00;
          }

          .label {
            font-size: 14px;
            color: #777;
          }

          .value {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
          }

          .message {
            margin-top: 20px;
            font-style: italic;
            font-size: 18px;
            padding: 15px;
            border-left: 4px solid #ff9800;
            background: #fff8e1;
          }

          @media print {
            body {
              background: white;
            }
          }
        </style>
      </head>

      <body>
        <div class="card">
          <h2>🎁 Special Greeting</h2>

          <div class="label">Occasion</div>
          <div class="value">${note.occasion || "-"}</div>

          <div class="label">Relation</div>
          <div class="value">${note.relation || "-"}</div>

          <div class="label">From</div>
          <div class="value">${note.toName || "-"}</div>

          <div class="message">
            "${note.message || ""}"
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.close();
          }
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};


  // Determine if the "Order Status" dropdown should be disabled
  const isOrderStatusDisabled =
    orderStatus === "Delivered" || orderStatus === "Cancelled";
  const isPaymentStatusDisabled = paymentStatus === "Success";
  console.log("DDDDDDDD::=>", orderData.specialNote);
  return (
    <>
      <div className="bread">
        <div className="head">
          <h4>Update Order</h4>
        </div>
        <div className="links">
          <Link to="/all-orders" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Order Details</h5>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th scope="row">Order ID</th>
                      <td>{orderData._id}</td>
                    </tr>
                    <tr>
                      <th scope="row">User Name</th>
                      <td>{orderData.name}</td>
                    </tr>
                    <tr>
                      <th scope="row">Email</th>
                      <td>{orderData.email}</td>
                    </tr>
                    <tr>
                      <th scope="row">Phone Number</th>
                      <td>{orderData.phone}</td>
                    </tr>
                    <tr>
                      <th scope="row">Address</th>
                      <td>
                        {orderData.address}, {orderData.city}, {orderData.state}
                        , {orderData.pin}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Order Date</th>
                      <td>{new Date(orderData.orderDate).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <th scope="row">Final Price</th>
                      <td>₹{orderData.totalPrice}</td>
                    </tr>
                    <tr>
                      <th scope="row">Order Status</th>
                      <td>
                        <select
                          className="form-select"
                          value={orderStatus}
                          onChange={(e) => setOrderStatus(e.target.value)}
                          disabled={isOrderStatusDisabled} // Disable the dropdown based on payment and status
                        >
                          <option value="Order Confirmed	">
                            Order Confirmed{" "}
                          </option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>

                    <tr>
                      <th scope="row">Order Status Massage</th>
                      <td>
                        {/* <select
                          className="form-select"
                          value={orderStatus}
                          onChange={(e) => setOrderStatus(e.target.value)}
                          disabled={isOrderStatusDisabled} // Disable the dropdown based on payment and status
                        >
                          <option value="Order Confirmed	">
                            Order Confirmed{" "}
                          </option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select> */}
                        <textarea type="text" value={orderStatusMassage} onChange={(e) => setOrderStatusMassage(e.target.value)} fullWidth />
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Payment Mode</th>
                      <td>{orderData.paymentMode}</td>
                    </tr>
                    <tr>
                      <th scope="row">Payment Status</th>
                      <td>
                        <select
                          className="form-select"
                          value={paymentStatus}
                          onChange={(e) => setPaymentStatus(e.target.value)}
                          disabled={isPaymentStatusDisabled} // Disable if payment is success
                        >
                          <option value="Pending">Pending</option>
                          <option value="Success">Success</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {orderData?.specialNote && (
              <div className="card mt-4 border-0 shadow-sm" style={{ marginTop: '100' }}>
                <div className="card-header bg-warning text-dark" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h5 className="mb-0">🎁 Special Note</h5>
                  <button
                    className="btn btn-light btn-sm print-btn"
                    onClick={() => handlePrint(orderData.specialNote)}
                  >
                    🖨 Print Card
                  </button>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="p-2 bg-light rounded">
                        <small className="text-muted">Occasion</small>
                        <h6 className="mb-0">{orderData.specialNote.occasion}</h6>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="p-2 bg-light rounded">
                        <small className="text-muted">Relation</small>
                        <h6 className="mb-0">{orderData.specialNote.relation}</h6>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="p-2 bg-light rounded">
                        <small className="text-muted">From</small>
                        <h6 className="mb-0">{orderData.specialNote.toName || '-'}</h6>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="p-2 bg-white border rounded">
                        <small className="text-muted">Message</small>
                        <p className="mb-0 mt-1 fst-italic">
                          "{orderData.specialNote.message}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Items</h5>
              </div>
              <div className="card-body">
                {orderData.cartItems && orderData.cartItems.length > 0 ? (
                  orderData.cartItems.map((item, index) => (
                    <div key={index} className="mb-3">
                      <strong>{item.name}</strong>
                      <br />
                      <p className="mb-1">Quantity: {item.quantity}</p>
                      <p className="mb-1">Weight: {item.weight}</p>
                      <p className="mb-1">Price: ₹{item.price}</p>
                      <p className="mb-1">
                        Delivery Date:{" "}
                        {new Date(item.deliveryDate).toLocaleString()}
                      </p>
                      <p className="mb-0">Message: {item?.massage}</p>
                      <img
                        src={`https://api.ssdipl.com/${item.image}`}
                        alt={item.name}
                        style={{
                          width: "100px",
                          height: "100px",
                          marginTop: "10px",
                        }}
                      />
                      <hr />
                    </div>
                  ))
                ) : (
                  <p>No items in the cart.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-4">
          <div className="card-header">
            <h5>Order Tracking Timeline</h5>
          </div>
          <div className="card-body">
            {orderData?.trackingOrders?.length > 0 ? (
              orderData?.trackingOrders
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((track, index) => (
                  <div key={index} className="tracking-item mb-3 p-3 border rounded">
                    <div className="d-flex justify-content-between">
                      <strong>{track.status}</strong>
                      <small className="text-muted">
                        {new Date(track.date).toLocaleString()}
                      </small>
                    </div>
                    <p className="mb-0 text-muted">{track.massage}</p>
                  </div>
                ))
            ) : (
              <p>No tracking updates available.</p>
            )}
          </div>
        </div>


        <div className="row mt-3">
          <div className="col">
            <button className="btn btn-primary" onClick={handleUpdate}>
              Update Order
            </button>
            <Link to="/all-orders" className="btn btn-secondary ms-2">
              Back
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default EditOrder;
