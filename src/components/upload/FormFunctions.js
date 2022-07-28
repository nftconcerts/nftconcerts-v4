import React from "react";

function FormFunctions() {
  function nextFormNum() {
    if (formNum === 8) return;
    scrollNext();
    setFormNum((formNum) => formNum + 1);
    if (formNum >= showFormNum) {
      setShowFormNum((showFormNum) => showFormNum + 1);
    }
    console.log(showFormNum);
  }

  function prevFormNum() {
    setFormNum((formNum) => formNum - 1);
    console.log(showFormNum);
  }
  function updateData(type, newFormData) {
    setFormData((formData) => {
      return { ...formData, [type]: newFormData };
    });
  }
  return <div>FormFunctions</div>;
}

export default FormFunctions;
