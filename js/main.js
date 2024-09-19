import { getData, getItembyId } from "./service.js";

const tab_items__list = document.querySelector(".tab_items__list");
const tab_btns = document.querySelectorAll(".tab_btn");
const products_list = document.querySelector(".products_list");
let active_btn = null;
const total = document.querySelector(".Sub_total_cost");

const renderItem = async (path) => {
  const data = await getData(path);
  console.log("Data fetched:", data);
  tab_items__list.innerHTML = data
    .map(
      (item) => `
        <li id="${item.id}" class="tab_item">
          <div class="tab_item_img_box">
            <img loading="lazy" class="img" src="${item.img}" alt="img">
          </div>
          <h2 class="tab_item_title">${item.title}</h2>
          <p class="tab_item_text_1">${item.price}</p>
          <p class="tab_item_text_2">${item.text}</p>
        </li>
      `
    )
    .join("");
  const tab_items = document.querySelectorAll(".tab_item");
  tab_items.forEach((item) => {
    item.addEventListener("click", async () => {
      const id = item.id;
      const data = await getItembyId(path, id);
      console.log("Item data fetched:", data);
      let oldData = JSON.parse(localStorage.getItem("selectedItem")) || [];
      console.log("Old data:", oldData);
      if (!Array.isArray(oldData)) {
        oldData = [];
      }
      const existingItem = oldData.find(
        (existingItem) => existingItem.id == id
      );
      if (!existingItem) {
        data.sum = 1; // Инициализация суммы
        localStorage.setItem(
          "selectedItem",
          JSON.stringify([...oldData, data])
        );
        renderProductItems();
      } else {
        existingItem.sum = (existingItem.sum || 0) + 1;
        localStorage.setItem("selectedItem", JSON.stringify(oldData));
        renderProductItems();
      }
    });
  });
};

tab_btns.forEach((item) => {
  item.addEventListener("click", () => {
    if (active_btn) {
      active_btn.classList.remove("bc");
    }
    item.classList.add("bc");
    active_btn = item;
    renderItem(item.dataset.path);
  });
});

const initialBtn = Array.from(tab_btns).find(
  (btn) => btn.dataset.path === "hotdishes"
);
if (initialBtn) {
  initialBtn.classList.add("bc");
  active_btn = initialBtn;
  renderItem("hotdishes");
}

const getLocal = () => {
  const data = JSON.parse(localStorage.getItem("selectedItem"));
  return data;
};

const renderProductItems = () => {
  const data = getLocal();
  console.log("Rendering product items:", data);
  products_list.innerHTML = data
    .map(
      (item) => `
        <li class="products_item">
          <div class="products_item_main">
            <div>
              <img class="pr_img" src="${item.img}" alt="img">
            </div>
            <div class="products_item_main_text_wrap">
              <h3 class="products_item_title">${item.title}</h3>
              <p class="products_item_price">${item.price}</p>
            </div>
          </div>
          <div class="products_item_des">
            <p class="products_item_sum">${item.sum || 1}</p>
            <p class="products_item_cost">${item.sum * Number(item.price)}</p>
            <button class="products_item_delete" data-id="${item.id}">
              <img src="./img/delete_btn.svg" alt="img">
            </button>
          </div>
        </li>
      `
    )
    .join("");

  const delete_btns = document.querySelectorAll(".products_item_delete");
  delete_btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      let oldData = JSON.parse(localStorage.getItem("selectedItem")) || [];
      const item = oldData.find((existingItem) => existingItem.id == id);
      if (item && item.sum > 1) {
        item.sum--;
      } else {
        oldData = oldData.filter((existingItem) => existingItem.id != id);
      }
      localStorage.setItem("selectedItem", JSON.stringify(oldData));
      renderProductItems();
    });
  });
  const totalSum = data.reduce(
    (sum, item) => sum + item.sum * Number(item.price),
    0
  );
  total.innerHTML = `${totalSum}$`;
};
renderProductItems();
