// document.querySelectorAll(".addButton, .addParameter, .addAttribute").forEach((button) => {
//   button.addEventListener("click", (event) => {
//     const section = event.target.closest(".section");
//     const parameterGroup = section.querySelector(".parameterGroup").cloneNode(true);
//     parameterGroup.querySelectorAll("input").forEach((input) => (input.value = ""));
//     section.insertBefore(parameterGroup, event.target);
//   });
// });

// document.addEventListener("click", (event) => {
//   if (event.target.classList.contains("removeButton")) {
//     const parameterGroup = event.target.closest(".parameterGroup");
//     parameterGroup.remove();
//   }
// });
