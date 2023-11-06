import * as yup from "yup";


export const removeFileExtension = (fileName) => {
  const lastDotIndex = fileName.lastIndexOf(".");
  const regex = /[^a-zA-Z0-9\s]/g;

  if (lastDotIndex === -1) {
      return fileName;
  } else {
      // Remove the file extension using substring
      const fileNameWithoutExtension = fileName.substring(0, lastDotIndex);
      return fileNameWithoutExtension.replace(regex, " ")
  }

}


export const yupschema = yup.object().shape({
  file: yup.mixed().required("You must upload the image of the product to use"),
  studentName: yup.string().required("You must add a 'display name'").min(5, "You need a minimum of 5 caharaters"),
  unitPrice: yup.string().required("You must add the price for the Product"),
  discount: yup.number().min(0, "You cant input a negative discount"),
  numberOfUnits: yup.number().required("You must add the number of units of available").min(0, "the number must be more than 0"),
  description: yup.string().required("Description field can not be left empty"),
  itemsIncluded: yup.string().required("Items included in the box must be emtered"),
});