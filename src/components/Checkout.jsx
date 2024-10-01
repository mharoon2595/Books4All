import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Trash } from "lucide-react";
import { decreaseCart } from "../utils/checkoutSlice";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { updateCount } from "../utils/firebase/fetchDB";
import { addBook } from "../utils/firebase/userActions";
import { borrow } from "../utils/checkoutSlice";

const Checkout = () => {
  const user = useSelector((state) => state.status.username);
  const cart = useSelector((state) => state.checkout.books);
  const idList = useSelector((state) => state.idSlice.list);
  const userId = useSelector((state) => state.idSlice.userId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function borrowBook(titleArr) {
    titleArr.forEach((title) => {
      updateCount(idList[title][1]);
      addBook(userId[user], title);
    });
    dispatch(borrow());
    swal("Great!", "Happy reading!", "success");
    navigate("/");
  }

  return (
    <div className="flex flex-col justify-center items-center  my-3 p-3">
      <p className="text-2xl font-semibold">Checkout</p>
      {cart &&
        cart.map((items) => {
          return (
            <div
              key={items}
              className="border-2 border-black flex justify-between min-w-[50%] p-3 rounded-lg my-3"
            >
              <p className="text-xl">{items}</p>
              <Trash
                className="h-5 w-5 mr-2 my-auto hover:cursor-pointer hover:scale-110"
                onClick={() => {
                  dispatch(decreaseCart(items));
                }}
              />
            </div>
          );
        })}

      <button
        className="bg-green-500 rounded-lg p-3 text-lg hover:scale-110"
        onClick={() => borrowBook(cart)}
      >
        Checkout
      </button>
    </div>
  );
};

export default Checkout;
