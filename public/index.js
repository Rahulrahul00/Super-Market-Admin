const tableBody = document.getElementById("table-body");
const totalPrice = document.getElementById("total-price");
const totalDiscount = document.getElementById("total-discount");
const totalAmount = document.getElementById("total-amount");

let addItem = async () => {
  const itemCode = document.getElementById("itemCode").value;
  const itemName = document.getElementById("itemName").value;
  const category = document.getElementById("category").value;
  const qty = parseFloat(document.getElementById("qty").value);
  const price = parseFloat(document.getElementById("price").value);
  const location = document.getElementById("location").value;

  if (!itemCode || !itemName || !category || !qty || !price || !location) {
    alert("Please fill out all the fields");
    return;
  }

  const response = await fetch("/add-item", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      itemCode,
      itemName,
      category,
      qty,
      price,
      location,
    }),
  });

  if (response.ok) {
    const item = await response.json();
    addRow(item);
  } else {
    alert("Error adding items");
  }
};

const addRow = (item) => {
  const row = `<tr>
        <td>${item.itemCode}</td>
        <td>${item.itemName}</td>
        <td>${item.category}</td>
        <td>${item.qty}</td>
        <td>${item.price}</td>
        <td>${item.tPrice}</td>
        <td>${item.tdiscount}</td>
        <td>${item.tamount}</td>
        <td>${item.location}</td>
        
      </tr>`;

      tableBody.innerHTML += row;

      updateTotals(item.tPrice, item.tdiscount, item.tamount);
}

let updateTotals = (tPrice,tdiscount,tamount)=>{
  totalPrice.textContent = (parseFloat(totalPrice.textContent) + tPrice).toFixed(2);
  totalDiscount.textContent = (parseFloat(totalDiscount.textContent) + tdiscount).toFixed(2);
  totalAmount.textContent = (parseFloat(totalAmount.textContent) + tamount).toFixed(2);


}

let fetchItems = async ()=>{
  const response = await fetch('/items');
    if(response.ok){
      const items = await response.json();
        items.forEach(addRow);
    }else{
        console.error('Error Fetching Items.');
    }
}

fetchItems();
