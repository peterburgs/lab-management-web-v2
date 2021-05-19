const baseUrl =
  "https://raw.githubusercontent.com/peterburgs/lab-management-server-v2/dev/uploads/images/";

const getImage = (imageName: string) => {
  return baseUrl + imageName;
};

export default getImage;
