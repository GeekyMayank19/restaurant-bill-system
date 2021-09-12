import React, { useState } from "react";
import { jsPDF } from "jspdf";
export default function Basket(props) {
  const [costumerName, setcostumerName] = useState("");
  const [tip, settip] = useState(0);

  const { cartItems, onAdd, onRemove ,setCartItems} = props;
  const itemsPrice = cartItems.reduce((a, c) => a + c.qty * c.price, 0);
  const taxPrice = itemsPrice * 0.03;
  const totalPrice = itemsPrice + taxPrice;
  const [tprice, setTprice] = useState(totalPrice);

  const priceTShow = () => {
    if (tprice === 0) {
      return totalPrice;
    } else {
      return tprice;
    }
  };

  const generatePfd = () => {
    var doc = new jsPDF("p", "pt");

    let arr = [];

    cartItems.map((item) => {
      let name = item.name;
      let qnt = item.qty;
      // arr.push(name);
      let obj = {
        name: name,
        qnt: qnt,
        price: item.price,
      };
      arr.push(obj);
    });

    var currentdate = new Date();
    var datetime =
      currentdate.getDay() +
      "/" +
      currentdate.getMonth() +
      "/" +
      currentdate.getFullYear() +
      " @ " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();

    doc.text(85, 20, "Restaurant XYX");
    doc.text(95, 40, "xyz location");
    doc.text(85, 60, "Ph-no 987654321");
    doc.text(0,80,"-----------------------------------------------------------")
    doc.text(95,100,"Data & Time")
    doc.text(75,120,`${datetime}`)
    doc.text(0,140,"-----------------------------------------------------------")
    doc.text(20,160, "Customer Name :");
    doc.text(200, 160, `${costumerName}`);
    doc.text(0,180,"-----------------------------------------------------------")
    doc.text(20,200, "ITEM");
    doc.text(200, 200, "QTY  AMOUNT");
    doc.text(0,220,"-----------------------------------------------------------")
    let x = 240;
    for (let i = 0; i < arr.length; i++) {
      doc.text(20, x, `${i + 1}. ${arr[i].name}`);
      doc.text(200, x, `${arr[i].qnt}  X     Rs ${arr[i].price} `);
      x += 20;
    }
    doc.text(0,x  ,"-----------------------------------------------------------")
    doc.text(20, x + 40, "Tax Price");
    doc.text(200, x + 40, `Rs ${taxPrice.toFixed(2)}`);
    doc.text(20, x + 60, "Tip Percentage");
    doc.text(200, x + 60, `${tip}%`);
    doc.text(0,x+80,"-----------------------------------------------------------")
    doc.text(20, x + 100, "Total Price");
    doc.text(200, x + 100, `Rs ${priceTShow().toFixed(2)}`);
    doc.text(0,x+ 120,"-----------------------------------------------------------")
    doc.save("file.pdf");
    setCartItems([]);
  };

  // setTprice(tprice=itemsPrice+taxPrice+tip);
  return (
    <aside className="block col-1">
      <h2>Order</h2>
      <div>
        {cartItems.length === 0 && <div>Cart is empty</div>}
        {cartItems.map((item) => (
          <div key={item.id} className="row">
            <div className="col-2">{item.name}</div>
            <div className="col-2">
              <button onClick={() => onRemove(item)} className="remove">
                -
              </button>{" "}
              <button onClick={() => onAdd(item)} className="add">
                +
              </button>
            </div>

            <div className="col-2 text-right">
              {item.qty} x Rs {item.price.toFixed(2)}
            </div>
          </div>
        ))}

        {cartItems.length !== 0 && (
          <>
            <hr></hr>
            <div className="row">
              <div className="col-2">Items Price</div>
              <div className="col-1 text-right">Rs {itemsPrice.toFixed(2)}</div>
            </div>
            <div className="row">
              <div className="col-2">Tax Price</div>
              <div className="col-1 text-right">Rs {taxPrice.toFixed(2)}</div>
            </div>
            <div className="row">
              <div className="col-2">Name</div>
              <div className="col-1 text-right">
                <input
                  onChange={(event) => setcostumerName(event.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-2">Tip Percentage</div>
              <div className="col-1 text-right">
                <input
                  placeholder="Enter tip percentage"
                  onChange={(e) => {
                    const val = e.target.value / 100;
                    settip(val);
                    const PercentOfT = val * totalPrice;
                    setTprice(parseFloat(totalPrice) + parseFloat(PercentOfT));
                  }}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-2">
                <strong>Total Price</strong>
              </div>
              <div className="col-1 text-right">
                <strong>Rs {priceTShow().toFixed(2)}</strong>
              </div>
            </div>
            <hr />
            <div className="row">
              <button onClick={generatePfd}>Print bill</button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
