import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { server } from "../../../config/index";
// to shwo order product in table
import TableOrder from "../../../components/product_components/TableOrder";
// icons
import {
  TruckIcon,
  ReplyIcon,
  CalendarIcon,
  SearchIcon,
} from "@heroicons/react/outline";
// calender
import DatePicker from "../../../components/admin/DatePicker";
import format from "date-fns/format";
import authHandler from "../../../shared/utils/auth/authHandler";

export default function index({ orders }) {
  const router = useRouter();

  // order state to send to order api
  const [ordSt, setOrdSt] = useState(orders);
  useEffect(() => {
    setOrdSt(orders);
  }, [orders]);

  // query keys and values states for searhing orders from api
  const [name, setName] = useState();
  const [lastname, setLastname] = useState();
  const [sent, setSent] = useState();
  const [dateQuery, setDateQuery] = useState();

  // date states for passing to DatePicker Component
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  //display calender boolean
  const [showCalender, setShowCalender] = useState(false);

  // when order delivered
  // change sent boolean in database and then change ui
  const UpdateSent = async (id, status) => {
    const data = await fetch(`${server}/api/order`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });
    const athorized = data.headers.get("authorized") === "true";
    const res = await data.json();
    if (athorized === true) {
      if (res.message && res.message == "updated") {
        var newOrders = ordSt;
        newOrders = newOrders.map((order) => {
          if (order._id === id) {
            order.sent = !res.docs.sent;
          }
          return order;
        });
        setOrdSt(newOrders);
      } else {
        alert("couldn't update order");
        console.log(res);
      }
    } else {
      router.push("/admin/login");
    }
  };

  // fech orders base on new query states
  const fetchOrders = () => {
    var keys = "";
    var values = "";
    // check for undefined and empty and white space
    if (name !== undefined && name !== "" && name.indexOf(" ") < 0) {
      keys = "name";
      values = name;
    }
    if (
      lastname !== undefined &&
      lastname !== "" &&
      lastname.indexOf(" ") < 0
    ) {
      keys += "_lastname";
      values += `_${lastname}`;
    }
    if (sent !== "undefined" && sent !== undefined) {
      keys += "_sent";
      values += `_${sent}`;
    }
    if (dateQuery !== undefined && dateQuery !== "") {
      keys += "_createdAt";
      values += `_${dateQuery}`;
    }
    // requesting new query
    router.push(server + "/admin/order?key=" + keys + "&value=" + values);
  };
  return (
    <div className="bg-secondary text-secondary min-h-screen py-8 px-4 relative w-full">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-third rounded-2xl shadow-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Order Management</h1>
              <p className="text-secondary">Manage and track customer orders</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{ordSt.length}</div>
                <div className="text-sm text-secondary">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {ordSt.filter(order => order.sent).length}
                </div>
                <div className="text-sm text-secondary">Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-alert">
                  {ordSt.filter(order => !order.sent).length}
                </div>
                <div className="text-sm text-secondary">In Process</div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-secondary rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center">
              <SearchIcon className="w-5 h-5 mr-2" />
              Search & Filter Orders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Customer First Name
                </label>
                <input
                  placeholder="Search by first name"
                  className="w-full bg-third border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none"
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Customer Last Name
                </label>
                <input
                  placeholder="Search by last name"
                  className="w-full bg-third border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none"
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Order Status
                </label>
                <select
                  className="w-full bg-third border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none"
                  value={sent}
                  onChange={(e) => setSent(e.target.value)}
                >
                  <option value="undefined">All Orders</option>
                  <option value="true">Delivered Orders</option>
                  <option value="false">In Process Orders</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Date Range
                </label>
                <button
                  className="w-full flex items-center justify-center py-3 px-4 bg-third border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  onClick={() => setShowCalender(true)}
                >
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  <span>Select Date Range</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="flex items-center justify-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                onClick={() => setDateQuery()}
              >
                <span>Reset Filters</span>
              </button>
              <button
                className="flex items-center justify-center px-6 py-3 bg-accent hover:bg-green-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                onClick={fetchOrders}
              >
                <SearchIcon className="w-5 h-5 mr-2" />
                <span>Search Orders</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* orders */}
      <ul className="my-5 sm:mx-3 p-6 sm:p-10">
        {ordSt.map((order, i) => (
          <li
            className={`relative px-9 py-5 my-3 rounded-2xl w-full
            ${order.sent ? "bg-[#2ea3fa]" : "bg-[#f1970e]"}`}
            key={i}
          >
            <div className="absolute top-0 right-0 pt-5 pr-8 text-white">
              <button
                onClick={() => {
                  UpdateSent(order._id, !order.sent);
                }}
              >
                {order.sent ? (
                  <ReplyIcon width={20} />
                ) : (
                  <TruckIcon width={20} />
                )}
              </button>
            </div>
            <div>
              <div className="text-gray-100">
                <span className="text-lg text-white">name: </span> {order.name}{" "}
                {order.lastname}
              </div>
              <div className="text-gray-100">
                <span className="text-lg text-white">phone: </span>{" "}
                {order.phone}
              </div>
              <div className="text-gray-100">
                <span className="text-lg text-white">address: </span>{" "}
                {order.address}
              </div>
              <div className="text-gray-100">
                <span className="text-lg text-white">order date: </span>{" "}
                {format(new Date(order.createdAt), "dd-MMM-yyy")}
              </div>
            </div>
            <div className="-px-9 sm:px-0">
              <TableOrder cart={order.cart} />
            </div>
          </li>
        ))}
      </ul>
      <style jsx>{`
        input[type="checkbox"] {
          opacity: 0.7;
        }
        input[type="checkbox"]:checked {
          opacity: 1;
        }
      `}</style>
      {/* date range calender conditional rendering */}
      {showCalender ? (
        <div className="z-50 absolute flex flex-col justify-center w-full h-screen bg-[#000000e3] top-0 lef-0 right-0">
          <div className="w-min mx-auto">
            <DatePicker state={date} setState={setDate} />
          </div>
          <button
            className="mt-8 px-6 py-2 bg-success mx-auto text-center rounded-full text-white text-xl"
            onClick={() => {
              setDateQuery(
                `${format(
                  new Date(date[0]["startDate"]),
                  "yyyy-MM-dd'T'HH:mm:ss.SSS"
                )}to${format(
                  new Date(date[0]["endDate"]),
                  "yyyy-MM-dd'T'HH:mm:ss.SSS"
                )}`
              );
              setShowCalender(false);
            }}
          >
            set date
          </button>
        </div>
      ) : null}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { authorized, access, refresh } = await authHandler(
    context.req,
    context.res,
    true
  );

  if (authorized === true) {
    const { key, value } = context.query;
    const response = await fetch(
      `${server}/api/order?key=${key}&value=${value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          refresh: refresh,
          access: access,
        },
      }
    );
    const data = await response.json();
    return {
      props: { orders: data.orders }, // will be passed to the page component as props
    };
  } else {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }
}
