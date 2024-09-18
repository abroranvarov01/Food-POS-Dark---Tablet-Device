import { getData } from "./service.js";

const tab_items__list = document.querySelector(".tab_items__list");
const tab_btns = document.querySelectorAll(".tab_btn");

let active_btn = null;

const renderItem = async (path) => {
  const data = await getData(path);
  tab_items__list.innerHTML = data
    .map(
      (item) => `
                          <li class="tab_item">
                            <div class="tab_item_img_box">
                                <img loading="lazy" class="img"
                                    src="${item.img}"
                                    alt="img">
                            </div>
                            <h2 class="tab_item_title">
                               ${item.title}"
                            </h2>
                            <p class="tab_item_text_1">${item.price}"</p>
                            <p class="tab_item_text_2">${item.text}"</p>
                        </li>
  `
    )
    .join("");
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
