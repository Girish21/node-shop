const deleteProduct = ref => {
  const productId = ref.parentNode.querySelector("[name=productId]").value;
  const csrf = ref.parentNode.querySelector("[name=_csrf]").value;

  const productElement = ref.closest("article");
  console.log(productElement);

  fetch(`/admin/delete-product/${productId}`, {
    method: "delete",
    headers: {
      "csrf-token": csrf
    }
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      productElement.parentNode.removeChild(productElement);
    })
    .catch(err => console.log(err));
};
